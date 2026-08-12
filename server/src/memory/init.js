import { client, collectionName, EMBEDDING_DIMENSIONS } from "./qdrant.js";

export async function initializeMemoryCollection() {
	const exists = await client.collectionExists(collectionName);

	// console.log(`Qdrant collection "${collectionName}" exists:`, exists.exists);

	if (exists.exists) {
		// console.log(`Qdrant collection "${collectionName}" already exists`);
		return;
	}

	await client.createCollection(collectionName, {
		vectors: {
			size: EMBEDDING_DIMENSIONS,
			distance: "Cosine",
		},
	});

	await client.createPayloadIndex(collectionName, {
		field_name: "userId",
		field_schema: "keyword",
	});

	console.log(`Created Qdrant collection "${collectionName}"`);
}
