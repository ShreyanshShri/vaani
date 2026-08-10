import { randomUUID } from "crypto";
import { getDB } from "../db/mongodb.js";

export async function saveMedicalEvent({
	userId,
	type,
	data,
	sourceText,
	timestamp,
}) {
	const db = getDB();

	const event = {
		_id: randomUUID(),
		userId,
		type,
		data,
		sourceText,
		timestamp: new Date(timestamp || Date.now()),
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	await db.collection("medical_events").insertOne(event);

	return {
		success: true,
		eventId: event._id,
	};
}

export async function getMedicalEvents({ userId, type, limit = 10 }) {
	const db = getDB();

	const query = {
		userId,
	};

	if (type) {
		query.type = type;
	}

	const events = await db
		.collection("medical_events")
		.find(query)
		.sort({ timestamp: -1 })
		.limit(limit)
		.toArray();

	return {
		success: true,
		events,
	};
}
