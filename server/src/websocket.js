// websocket.js
import { WebSocketServer } from "ws";
import { createPrimaryAgent } from "./agent/primary.js";
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

		// Audio is allowed through only when this gate is open.
		let audioGateOpen = true;

		// Queue to pace outgoing binary audio chunks.
		let audioQueue = [];
		let isSending = false;

		function drainAudioQueue() {
			// Hard stop.
			if (!audioGateOpen) {
				audioQueue = [];
				isSending = false;
				return;
			}

			if (audioQueue.length === 0) {
				isSending = false;
				return;
			}

			isSending = true;

			const chunk = audioQueue.shift();

			if (ws.readyState === ws.OPEN && audioGateOpen) {
				ws.send(chunk, { binary: true }, () => {
					setImmediate(drainAudioQueue);
				});
			} else {
				isSending = false;
			}
		}

		try {
			rime = createRimeSession((audioChunk) => {
				// Rime can continue delivering chunks after
				// Gemini has interrupted. Drop them.
				if (!audioGateOpen) {
					return;
				}

				if (ws.readyState === ws.OPEN) {
					audioQueue.push(audioChunk);

					if (!isSending) {
						drainAudioQueue();
					}
				}
			});

			agent = await createPrimaryAgent(userId, {
				// Gemini output transcription arrives here.
				onText: (text) => {
					// Do not feed stale text to Rime while interrupted.
					if (!audioGateOpen) {
						return;
					}

					rime.sendText(text);
				},

				// Flush remaining buffered TTS text when model turn completes.
				onTurnComplete: () => {
					if (!audioGateOpen) {
						return;
					}

					if (rime) {
						rime.flush();
					}
				},

				onUserText: (observation) => {
					processMemory({
						userId,
						sessionId,
						...observation,
					}).catch((error) => {
						console.error("Memory processing failed:", error);
					});
				},

				// Gemini has detected that the user interrupted
				// the current model response.
				onInterrupt: () => {
					console.log(">>> GEMINI INTERRUPTED — CLOSING AUDIO GATE");

					// 1. Close the gate FIRST.
					audioGateOpen = false;

					// 2. Drop anything waiting on our server.
					audioQueue = [];

					// 3. Clear Rime's pending text.
					if (rime) {
						rime.clear();
					}

					// 4. Immediately tell browser to stop
					//    already-scheduled playback.
					if (ws.readyState === ws.OPEN) {
						ws.send(
							JSON.stringify({
								type: "interrupt",
							}),
						);
					}
				},

				// First output transcription of the new response.
				onOutputStart: () => {
					// console.log(">>> NEW OUTPUT — OPENING AUDIO GATE");

					audioGateOpen = true;
				},

				onAudioStart: () => {},
			});
		} catch (error) {
			console.error("Failed to create Gemini session:", error);

			ws.close();
			return;
		}

		ws.on("message", (data, isBinary) => {
			if (!isBinary) {
				return;
			}

			try {
				// DO NOT clear Rime here.
				//
				// These are microphone packets, not interruption
				// signals. Gemini's VAD is responsible for deciding
				// when an interruption actually happened.

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

			audioGateOpen = false;
			audioQueue = [];

			if (rime) {
				rime.close();
			}

			if (agent) {
				agent.close();
			}
		});
	});

	return wss;
}
