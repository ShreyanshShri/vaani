// websocket.js
import { WebSocketServer } from "ws";
import { createPrimaryAgent } from "./agent/primary.js";
import { executeTool } from "./agent/toolExecutor.js";
import { createRimeSession } from "./tts/rime.js";

export function setupWebSocketServer(server) {
	// Attach WebSocket to the existing HTTP server instance
	const wss = new WebSocketServer({ server });

	wss.on("connection", async (ws, req) => {
		// Tip: You can extract auth tokens or user details from `req.url` or cookies here
		const userId = "test-user-001";
		let agent;
		let rime;

		try {
			rime = createRimeSession((audioChunk) => {
				if (ws.readyState === ws.OPEN) {
					ws.send(audioChunk, { binary: true });
				}
			});

			agent = await createPrimaryAgent(userId, {
				onText: (text) => {
					rime.sendText(text);
				},
				onAudioStart: () => {
					console.log("AI audio started");
				},
			});
		} catch (error) {
			console.error("Failed to create Gemini session:", error);
			ws.close();
			return;
		}

		ws.on("message", (data, isBinary) => {
			if (!isBinary) return;

			try {
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
			if (agent) agent.close();
		});
	});

	return wss;
}
