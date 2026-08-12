import { randomUUID } from "crypto";
import { client, collectionName } from "../memory/qdrant.js";
import { generateEmbedding } from "../memory/embeddings.js";

export async function saveMedicalMemory({
	userId,
	text,
	category = "other",
	metadata = {},
	timestamp,
}) {
	console.log("========== QDRANT SAVE ==========");

	const memoryId = randomUUID();
	const vector = await generateEmbedding(text);

	const now = new Date().toISOString();

	const payload = {
		userId,
		text,
		category,
		metadata,
		timestamp: timestamp || now,
		createdAt: now,
		updatedAt: now,
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
		category,
	};
}

export async function saveMedicationMemory({
	userId,
	text,
	metadata = {},
	timestamp,
}) {
	return saveMedicalMemory({
		userId,
		text,
		category: "medication",
		metadata,
		timestamp,
	});
}

export async function saveSymptomMemory({
	userId,
	text,
	metadata = {},
	timestamp,
}) {
	return saveMedicalMemory({
		userId,
		text,
		category: "symptom",
		metadata,
		timestamp,
	});
}

export async function saveFoodMemory({
	userId,
	text,
	metadata = {},
	timestamp,
}) {
	return saveMedicalMemory({
		userId,
		text,
		category: "food",
		metadata,
		timestamp,
	});
}

export async function saveMeasurementMemory({
	userId,
	text,
	metadata = {},
	timestamp,
}) {
	return saveMedicalMemory({
		userId,
		text,
		category: "measurement",
		metadata,
		timestamp,
	});
}

export async function saveAppointmentMemory({
	userId,
	text,
	metadata = {},
	timestamp,
}) {
	return saveMedicalMemory({
		userId,
		text,
		category: "appointment",
		metadata,
		timestamp,
	});
}

export async function saveConditionMemory({
	userId,
	text,
	metadata = {},
	timestamp,
}) {
	return saveMedicalMemory({
		userId,
		text,
		category: "condition",
		metadata,
		timestamp,
	});
}

export async function saveLifestyleMemory({
	userId,
	text,
	metadata = {},
	timestamp,
}) {
	return saveMedicalMemory({
		userId,
		text,
		category: "lifestyle",
		metadata,
		timestamp,
	});
}

export async function searchMedicalMemory({
	userId,
	query,
	category,
	limit = 5,
}) {
	const vector = await generateEmbedding(query);

	const must = [
		{
			key: "userId",
			match: {
				value: userId,
			},
		},
	];

	if (category) {
		must.push({
			key: "category",
			match: {
				value: category,
			},
		});
	}

	const results = await client.query(collectionName, {
		query: vector,
		filter: {
			must,
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
			category: point.payload?.category,
			metadata: point.payload?.metadata,
			timestamp: point.payload?.timestamp,
			createdAt: point.payload?.createdAt,
			updatedAt: point.payload?.updatedAt,
		})),
	};
}

export async function searchMedicationMemory({ userId, query, limit = 5 }) {
	return searchMedicalMemory({
		userId,
		query,
		category: "medication",
		limit,
	});
}

export async function searchSymptomMemory({ userId, query, limit = 5 }) {
	return searchMedicalMemory({
		userId,
		query,
		category: "symptom",
		limit,
	});
}

export async function searchFoodMemory({ userId, query, limit = 5 }) {
	return searchMedicalMemory({
		userId,
		query,
		category: "food",
		limit,
	});
}

export async function searchMeasurementMemory({ userId, query, limit = 5 }) {
	return searchMedicalMemory({
		userId,
		query,
		category: "measurement",
		limit,
	});
}

export async function searchAppointmentMemory({ userId, query, limit = 5 }) {
	return searchMedicalMemory({
		userId,
		query,
		category: "appointment",
		limit,
	});
}

export async function getMedicalMemories({ userId, category, limit = 20 }) {
	const must = [
		{
			key: "userId",
			match: {
				value: userId,
			},
		},
	];

	if (category) {
		must.push({
			key: "category",
			match: {
				value: category,
			},
		});
	}

	const results = await client.scroll(collectionName, {
		filter: {
			must,
		},
		limit,
		with_payload: true,
	});

	return {
		success: true,
		results: results.points.map((point) => ({
			memoryId: point.id,
			text: point.payload?.text,
			category: point.payload?.category,
			metadata: point.payload?.metadata,
			timestamp: point.payload?.timestamp,
			createdAt: point.payload?.createdAt,
			updatedAt: point.payload?.updatedAt,
		})),
	};
}

export async function getMedicationMemory({ userId, limit = 20 }) {
	return getMedicalMemories({
		userId,
		category: "medication",
		limit,
	});
}

export async function getSymptomMemory({ userId, limit = 20 }) {
	return getMedicalMemories({
		userId,
		category: "symptom",
		limit,
	});
}

export async function getFoodHistoryMemory({ userId, limit = 20 }) {
	return getMedicalMemories({
		userId,
		category: "food",
		limit,
	});
}

export async function getMeasurementMemory({ userId, limit = 20 }) {
	return getMedicalMemories({
		userId,
		category: "measurement",
		limit,
	});
}

export async function getAppointmentMemory({ userId, limit = 20 }) {
	return getMedicalMemories({
		userId,
		category: "appointment",
		limit,
	});
}

export async function getConditionMemory({ userId, limit = 20 }) {
	return getMedicalMemories({
		userId,
		category: "condition",
		limit,
	});
}

export async function getLifestyleMemory({ userId, limit = 20 }) {
	return getMedicalMemories({
		userId,
		category: "lifestyle",
		limit,
	});
}
