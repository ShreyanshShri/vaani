import { GoogleGenAI } from "@google/genai";
import { memoryAgentTools } from "./memoryTools.js";
import { executeMemoryTool } from "./memoryToolExecutor.js";

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.1-flash-lite";

export async function processMemory({
	userId,
	userText,
	timestamp,
	sessionId,
}) {
	try {
		const contents = [
			{
				role: "user",
				parts: [
					{
						text: JSON.stringify({
							userText,
							timestamp,
							sessionId,
						}),
					},
				],
			},
		];

		let response = await ai.models.generateContent({
			model: MODEL,
			contents,

			config: {
				tools: memoryAgentTools,

				systemInstruction: {
					parts: [
						{
							text: `
You are the long-term memory management agent for a digital nurse.

Your job is NOT to remember everything the user says.

Your default behavior is:
DO NOT SAVE.

==================================================
LANGUAGE & FORMATTING CONSTRAINTS
==================================================

1. LANGUAGE LOCK: You MUST generate all tool call arguments in the EXACT SAME LANGUAGE as the user's input. 
   - NEVER translate user statements into Spanish, English, or any other language unless the user explicitly spoke in that language.
   - If the user speaks English, all tool call parameters MUST be strictly in English.
   - Do not translate to any other language except for Hindi and English.

2. NO ASSUMPTIONS / NO INTERPRETATIONS:
   - Extract facts verbatim or summarize strictly within the source language.
   - Do not translate terms, medical jargon, or preferences.

==================================================
DEFAULT RULE: DO NOT SAVE
==================================================

Only save information when it has clear, persistent value for future medical conversations.

A statement should generally be saved only if it represents a durable fact, a concrete medical event, a clinically relevant preference, or an important piece of ongoing context.

Donot Save UserId in memory. So dont do anything like - "text":"The user is named test-user-001."

==================================================
DO NOT SAVE THESE
==================================================

Never save:
- greetings, goodbyes, acknowledgements, thanks
- yes/no answers to conversational questions
- answers that only respond to the previous assistant message
- conversational confirmations, requests for information, questions
- casual conversation, small talk
- opinions with no future relevance
- temporary conversational statements
- statements that merely continue the current conversation
- assistant-generated information or interpretations of what the user said
- paraphrases of previous conversation
- "the user answered yes/no/agreed/disagreed/asked about..."
- any statement whose only meaning depends on the immediately preceding assistant message

Examples that MUST NOT be saved:
"Yes.", "No.", "Okay.", "Sure.", "Thanks.", "That's fine.", "No, I don't.", "Yes, that's correct.", "I understand.", "What do you mean?", "Tell me more.", "I don't know.", "Maybe.", "I think so."

==================================================
SAVE TO MONGODB WHEN
==================================================

Use save_medical_event when the user reports a concrete medical event or structured medical fact.

Examples (English input -> English tool parameters):
- "I took my amlodipine at 8 AM."
- "My blood pressure is 145/95."
- "I have had a fever since yesterday."
- "I vomited twice today."
- "I ate two bananas for breakfast."
- "I have a doctor's appointment on Friday."
- "I took 500mg paracetamol."

==================================================
SAVE TO QDRANT WHEN
==================================================

Use save_medical_memory only for information that is likely to remain useful across future conversations.

Examples (English input -> English tool parameters):
- "I am vegetarian."
- "I am allergic to peanuts."
- "I usually forget my medication when I wake up late."
- "I prefer taking my medicine after breakfast."
- "My doctor told me to increase my protein intake."
- "I have difficulty swallowing tablets."

==================================================
IMPORTANT DECISION RULE
==================================================

Before calling ANY memory tool, ask yourself:
"If this information disappeared after this conversation, would it meaningfully reduce our ability to help this user in a future conversation?"

If the answer is NO: DO NOT CALL A TOOL.
When uncertain: DO NOT SAVE.

It is better to miss a low-value memory than to fill the user's memory with conversational noise.
Never create a memory merely because the user's sentence contains information.
Never infer a persistent fact from a temporary conversational response.
Only save what the user explicitly stated or what is an unambiguous concrete medical event.

User ID:
${userId}

User ID:
${userId}
			`,
						},
					],
				},
			},
		});

		while (response.functionCalls?.length) {
			const functionResponses = [];

			for (const functionCall of response.functionCalls) {
				const name = functionCall.name;
				const args = functionCall.args || {};

				console.log("MEMORY TOOL CALL:", name);
				console.log("MEMORY TOOL ARGS:", args);

				try {
					const result = await executeMemoryTool(name, args, userId);

					console.log("MEMORY TOOL RESULT:", result);

					functionResponses.push({
						name,
						id: functionCall.id,
						response: {
							result,
						},
					});
				} catch (error) {
					console.error(`Memory tool ${name} failed:`, error);

					functionResponses.push({
						name,
						id: functionCall.id,
						response: {
							error: error.message,
						},
					});
				}
			}

			contents.push({
				role: "model",
				parts: response.candidates[0].content.parts,
			});

			contents.push({
				role: "user",
				parts: functionResponses.map((functionResponse) => ({
					functionResponse,
				})),
			});

			response = await ai.models.generateContent({
				model: MODEL,
				contents,

				config: {
					tools: memoryAgentTools,

					systemInstruction: {
						parts: [
							{
								text: `
You are the memory management agent for a digital nurse.

Your job is to determine whether the user's statement contains
information that should be persisted for future use.

The requested memory tools have now been executed.

Do not create additional memories unless another tool call is
actually necessary.
								`,
							},
						],
					},
				},
			});
		}

		console.log("MEMORY AGENT COMPLETE:", response.text || "No text response");

		return response;
	} catch (error) {
		console.error("Memory agent failed:", error);
	}
}
