import WebSocket from "ws";

const RIME_API_KEY = process.env.RIME_API_KEY;

const RIME_URL =
	"wss://users-ws.rime.ai/ws3?speaker=nadi&modelId=coda&audioFormat=pcm";

export function createRimeSession(onAudio) {
	const ws = new WebSocket(RIME_URL, {
		headers: {
			Authorization: `Bearer ${RIME_API_KEY}`,
		},
	});

	ws.on("open", () => {
		console.log("Rime WebSocket opened");
	});

	ws.on("message", (data) => {
		try {
			const message = JSON.parse(data.toString("utf-8"));

			// Check if it's an audio chunk
			if (message.type === "chunk" && message.data) {
				// Convert base64 string to a raw PCM Buffer
				const audioBuffer = Buffer.from(message.data, "base64");

				// Pass raw binary audio to your callback
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

	return {
		sendText(text) {
			if (ws.readyState !== WebSocket.OPEN) {
				return;
			}

			const payload = JSON.stringify({
				text: text,
			});

			ws.send(payload);
		},

		clear() {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send("<CLEAR>");
			}
		},

		flush() {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send("<FLUSH>");
			}
		},

		close() {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send("<EOS>");
			}
		},
	};
}
