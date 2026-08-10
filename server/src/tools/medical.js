// tools/medical.js

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

	const now = new Date();

	const event = {
		_id: randomUUID(),
		userId,
		type,
		data,
		sourceText,
		timestamp: new Date(timestamp || Date.now()),
		createdAt: now,
		updatedAt: now,
	};

	await db.collection("medical_events").insertOne(event);

	return {
		success: true,
		eventId: event._id,
	};
}

export async function updateMedicalEvent({
	userId,
	eventId,
	data,
	sourceText,
	timestamp,
}) {
	const db = getDB();

	const update = {
		updatedAt: new Date(),
	};

	if (data !== undefined) {
		update.data = data;
	}

	if (sourceText !== undefined) {
		update.sourceText = sourceText;
	}

	if (timestamp !== undefined) {
		update.timestamp = new Date(timestamp);
	}

	const result = await db.collection("medical_events").updateOne(
		{
			_id: eventId,
			userId,
		},
		{
			$set: update,
		},
	);

	return {
		success: result.matchedCount === 1,
		updated: result.modifiedCount === 1,
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
