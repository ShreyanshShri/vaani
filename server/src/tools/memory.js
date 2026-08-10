import { randomUUID } from "crypto";
import { client, collectionName } from "../memory/qdrant.js";
import { generateEmbedding } from "../memory/embeddings.js";

export async function saveMedicalMemory({
	userId,
	text,
	metadata = {},
	timestamp,
}) {
	console.log("========== QDRANT SAVE ==========");
	console.log("URL:", process.env.QDRANT_URL);
	console.log("Collection:", collectionName);

	const exists = await client.collectionExists(collectionName);

	console.log("Collection exists:", exists);

	const collections = await client.getCollections();

	console.log(
		"Available collections:",
		collections.collections.map((c) => c.name),
	);

	if (!exists) {
		throw new Error(
			`Qdrant collection "${collectionName}" does not exist at save time`,
		);
	}

	const memoryId = randomUUID();

	const vector = await generateEmbedding(text);

	const payload = {
		userId,
		text,
		metadata,
		timestamp: timestamp || new Date().toISOString(),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	await client.upsert(collectionName, {
		points: [
			{
				id: memoryId,
				vector,
				payload,
			},
		],
	});

	return {
		success: true,
		memoryId,
	};
}

export async function searchMedicalMemory({ userId, query, limit = 5 }) {
	const vector = await generateEmbedding(query);

	const results = await client.query(collectionName, {
		query: vector,

		filter: {
			must: [
				{
					key: "userId",
					match: {
						value: userId,
					},
				},
			],
		},

		limit,

		with_payload: true,
	});

	return {
		success: true,
		results: results.points.map((point) => ({
			memoryId: point.id,
			score: point.score,
			text: point.payload?.text,
			metadata: point.payload?.metadata,
			createdAt: point.payload?.createdAt,
			updatedAt: point.payload?.updatedAt,
		})),
	};
}

export async function updateMedicalMemory({
	userId,
	memoryId,
	text,
	metadata = {},
}) {
	const existing = await client.retrieve(collectionName, {
		ids: [memoryId],
		with_payload: true,
	});

	if (!existing.length) {
		return {
			success: false,
			error: "Memory not found",
		};
	}

	if (existing[0].payload?.userId !== userId) {
		return {
			success: false,
			error: "Memory does not belong to user",
		};
	}

	const vector = await generateEmbedding(text);

	const createdAt = existing[0].payload?.createdAt || new Date().toISOString();

	const updatedAt = new Date().toISOString();

	await client.upsert(collectionName, {
		points: [
			{
				id: memoryId,
				vector,
				payload: {
					userId,
					text,
					metadata,
					createdAt,
					updatedAt,
				},
			},
		],
	});

	return {
		success: true,
		memoryId,
	};
}
