import { GoogleGenAI } from "@google/genai";
import { EMBEDDING_MODEL, EMBEDDING_DIMENSIONS } from "./qdrant.js";
import { createHash } from "crypto";
import { getCache, setCache } from "../config/redis.js";

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

export async function generateEmbedding(text) {
	const hash = createHash("md5").update(text).digest("hex");
	const cacheKey = `embedding:${EMBEDDING_MODEL}:${EMBEDDING_DIMENSIONS}:${hash}`;

	const cached = await getCache(cacheKey);
	if (cached) {
		return cached;
	}

	const response = await ai.models.embedContent({
		model: EMBEDDING_MODEL,
		contents: text,
		config: {
			outputDimensionality: EMBEDDING_DIMENSIONS,
		},
	});

	const embedding = response.embeddings[0].values;

	await setCache(cacheKey, embedding, 86400);

	return embedding;
}
