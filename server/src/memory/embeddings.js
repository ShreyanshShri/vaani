import { GoogleGenAI } from "@google/genai";
import { EMBEDDING_MODEL, EMBEDDING_DIMENSIONS } from "./qdrant.js";

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

export async function generateEmbedding(text) {
	const response = await ai.models.embedContent({
		model: EMBEDDING_MODEL,
		contents: text,
		config: {
			outputDimensionality: EMBEDDING_DIMENSIONS,
		},
	});

	return response.embeddings[0].values;
}
