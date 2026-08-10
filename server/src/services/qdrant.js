import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
	url: process.env.QDRANT_URL,
});

const collectionName = process.env.QDRANT_COLLECTION;

export async function initQdrant() {
	const collections = await client.getCollections();

	const exists = collections.collections.some(
		(collection) => collection.name === collectionName,
	);

	if (!exists) {
		await client.createCollection(collectionName, {
			vectors: {
				size: 1536,
				distance: "Cosine",
			},
		});

		console.log(`Created Qdrant collection: ${collectionName}`);
	}
}

export { client, collectionName };
