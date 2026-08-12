import WebSocket from "ws";

const RIME_API_KEY = process.env.RIME_API_KEY;
const RIME_URL =
    "wss://users-ws.rime.ai/ws3?speaker=nadi&modelId=coda&audioFormat=pcm";

// Helper to strip markdown and characters that cause TTS voice glitches
function cleanTextForSpeech(text) {
    return text
        .replace(/[*_~`#\-]/g, "") // Strip Markdown tags (**, _, #, etc.)
        .replace(/\s+/g, " ");      // Normalize extra spaces
}

export function createRimeSession(onAudio) {
    const ws = new WebSocket(RIME_URL, {
        headers: {
            Authorization: `Bearer ${RIME_API_KEY}`,
        },
    });

    let textBuffer = "";
    const sendQueue = []; // Holds payloads sent before WebSocket connection opens

    ws.on("open", () => {
        console.log("Rime WebSocket opened");
        // Flush payloads queued during connection setup
        while (sendQueue.length > 0) {
            const payload = sendQueue.shift();
            ws.send(payload);
        }
    });

    ws.on("message", (data) => {
        try {
            const message = JSON.parse(data.toString("utf-8"));

            if (message.type === "chunk" && message.data) {
                const audioBuffer = Buffer.from(message.data, "base64");
                onAudio(audioBuffer);
            } else if (message.type === "done") {
                console.log(
                    "Rime completed audio generation for context:",
                    message.contextId,
                );
            } else if (message.type === "error") {
                console.error("Rime API Error:", message.message);
            }
        } catch (err) {
            console.error("Failed to parse message from Rime:", err);
        }
    });

    ws.on("error", (error) => {
        console.error("Rime WebSocket error:", error);
    });

    ws.on("close", () => {
        console.log("Rime WebSocket closed");
    });

    // Internal helper to safely send or queue messages
    function transmit(payload) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(payload);
        } else if (ws.readyState === WebSocket.CONNECTING) {
            sendQueue.push(payload);
        }
    }

    return {
        /**
         * Buffers incoming LLM stream tokens and sends complete clauses to Rime.
         * Prevents audio breaking caused by synthesizing partial token fragments.
         */
        sendText(text) {
            textBuffer += text;

            // Extract complete clauses ending with punctuation (. , ? ! ; \n)
            const delimiterRegex = /([^.,?!;\n]+[.,?!;\n]+)/g;
            let match;
            let lastIndex = 0;

            while ((match = delimiterRegex.exec(textBuffer)) !== null) {
                const clause = cleanTextForSpeech(match[0]);
                if (clause.trim()) {
                    transmit(JSON.stringify({ text: clause }));
                }
                lastIndex = delimiterRegex.lastIndex;
            }

            // Keep the trailing unpunctuated fragment in the buffer
            textBuffer = textBuffer.slice(lastIndex);
        },

        /**
         * Flushes remaining text in the buffer and forces Rime audio generation.
         */
        flush() {
            if (textBuffer.trim()) {
                const cleaned = cleanTextForSpeech(textBuffer);
                transmit(JSON.stringify({ text: cleaned }));
                textBuffer = "";
            }
            transmit("<FLUSH>");
        },

        clear() {
            textBuffer = "";
            transmit("<CLEAR>");
        },

        close() {
            this.flush();
            transmit("<EOS>");
        },
    };
}