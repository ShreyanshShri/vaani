import { client, collectionName } from "../memory/qdrant.js";

export async function searchMedicalMemory({ userId, query, limit = 5 }) {
	console.log("Qdrant search requested:");

	console.log({
		userId,
		query,
		limit,
	});

	/*
	 * Embedding generation goes here later.
	 */

	return {
		success: true,
		results: [],
	};
}
