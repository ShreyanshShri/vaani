// websocket.js
import { WebSocketServer } from "ws";
import { createPrimaryAgent } from "./agent/primary.js";
import { executeTool } from "./agent/toolExecutor.js";
import { createRimeSession } from "./tts/rime.js";
import { processMemory } from "./agent/memory.js";
import { randomUUID } from "crypto";

export function setupWebSocketServer(server) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", async (ws, req) => {
        const userId = "test-user-001";
        const sessionId = randomUUID();
        let agent;
        let rime;

        // Queue to pace outgoing binary audio chunks and prevent WebSocket socket congestion
        let audioQueue = [];
        let isSending = false;

        function drainAudioQueue() {
            if (audioQueue.length === 0) {
                isSending = false;
                return;
            }
            isSending = true;
            const chunk = audioQueue.shift();

            if (ws.readyState === ws.OPEN) {
                ws.send(chunk, { binary: true }, () => {
                    setImmediate(drainAudioQueue);
                });
            } else {
                isSending = false;
            }
        }

        try {
            rime = createRimeSession((audioChunk) => {
                if (ws.readyState === ws.OPEN) {
                    audioQueue.push(audioChunk);
                    if (!isSending) {
                        drainAudioQueue();
                    }
                }
            });

            agent = await createPrimaryAgent(userId, {
                onText: (text) => {
                    rime.sendText(text);
                },

                // Flushes remaining buffered TTS text when model turn completes
                onTurnComplete: () => {
                    if (rime) rime.flush();
                },

                onUserText: (observation) => {
                    // Non-blocking background execution
                    processMemory({
                        userId,
                        sessionId,
                        ...observation,
                    }).catch((error) => {
                        console.error("Memory processing failed:", error);
                    });
                },

                onAudioStart: () => {},
            });
        } catch (error) {
            console.error("Failed to create Gemini session:", error);
            ws.close();
            return;
        }

        ws.on("message", (data, isBinary) => {
            if (!isBinary) return;

            try {
                // Interruption handling: stop playing stale audio if user speaks
                if (audioQueue.length > 0) {
                    audioQueue = [];
                    if (rime) rime.clear();
                }

                agent.sendRealtimeInput({
                    audio: {
                        data: Buffer.from(data).toString("base64"),
                        mimeType: "audio/pcm;rate=16000",
                    },
                });
            } catch (error) {
                console.error("Failed to send audio:", error);
            }
        });

        ws.on("close", () => {
            console.log("Browser disconnected");
            audioQueue = [];
            if (rime) rime.close();
            if (agent) agent.close();
        });
    });

    return wss;
}