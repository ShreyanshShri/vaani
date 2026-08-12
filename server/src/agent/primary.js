import { GoogleGenAI, Modality } from "@google/genai";
import { primaryAgentTools } from "./primaryTools.js";
import { executeTool } from "./primaryToolExecutor.js";

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.1-flash-live-preview";

export async function createPrimaryAgent(userId, callbacks = {}) {
	let session;

	session = await ai.live.connect({
		model: MODEL,

		config: {
			responseModalities: [Modality.AUDIO],

			tools: primaryAgentTools,

			outputAudioTranscription: {},
			inputAudioTranscription: {},

			systemInstruction: {
				parts: [
					{
						text: `
You are the primary female conversational agent for a digital nurse named Vaani.

The user may speak English, Hindi, or a mixture of both.

Understand Hindi and English.
Respond in the same language as the user.

Keep responses concise because they will eventually be spoken aloud.

Do not invent medical information or claim that an action was performed
unless the appropriate tool was actually executed.
`,
					},
				],
			},
		},

		callbacks: {
			onopen: () => {
				console.log("Gemini WebSocket opened");
			},

			onmessage: async (message) => {
				const serverContent = message.serverContent;

				// --------------------------------------------------
				// INTERRUPTION
				// --------------------------------------------------

				if (serverContent?.interrupted) {
					console.log(">>> GEMINI INTERRUPTED");

					callbacks.onInterrupt?.();
				}

				// --------------------------------------------------
				// MODEL OUTPUT TRANSCRIPTION
				// --------------------------------------------------

				if (serverContent?.outputTranscription?.text) {
					const text = serverContent.outputTranscription.text;

					console.log("AI Text Output:", text);

					// This is the signal that a new model
					// response is actually producing output.
					callbacks.onOutputStart?.();

					callbacks.onText?.(text);
				}

				// --------------------------------------------------
				// USER TRANSCRIPTION
				// --------------------------------------------------

				if (serverContent?.inputTranscription?.text) {
					const text = serverContent.inputTranscription.text;

					callbacks.onUserText?.({
						userText: text,
						timestamp: new Date().toISOString(),
					});
				}

				// --------------------------------------------------
				// TOOL CALL
				// --------------------------------------------------

				if (message.toolCall) {
					console.log("TOOL CALL:", JSON.stringify(message.toolCall, null, 2));

					const functionResponses = [];

					for (const functionCall of message.toolCall.functionCalls) {
						const name = functionCall.name;
						const args = functionCall.args || {};

						console.log("Executing:", name);

						console.log("Args:", args);

						try {
							const result = await executeTool(name, args, userId);

							console.log("Tool result:", result);

							functionResponses.push({
								name,
								id: functionCall.id,
								response: {
									result,
								},
							});
						} catch (error) {
							console.error(`Tool ${name} failed:`, error);

							functionResponses.push({
								name,
								id: functionCall.id,
								response: {
									error: error.message,
								},
							});
						}
					}

					session.sendToolResponse({
						functionResponses,
					});

					console.log("Tool response sent to Gemini");
				}
			},

			onerror: (error) => {
				console.error("Gemini WebSocket error:", error);
			},

			onclose: (event) => {
				console.log("Gemini WebSocket closed:", event?.reason);
			},
		},
	});

	return session;
}
