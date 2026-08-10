import { QdrantClient } from "@qdrant/js-client-rest";

export const client = new QdrantClient({
	host: "localhost",
	port: 6333,
});

export const collectionName = "medical_memory";

export const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMENSIONS = 768;
