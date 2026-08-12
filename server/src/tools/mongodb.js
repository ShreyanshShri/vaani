// tools/medical.js

import { randomUUID } from "crypto";
import { getDB } from "../db/mongodb.js";

/* =========================
   MEDICAL EVENTS
========================= */

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

/* =========================
   MEDICATIONS
========================= */

export async function saveMedication({
	userId,
	name,
	dosage,
	form,
	frequency,
	instructions,
	startDate,
	endDate,
	prescribedBy,
	sourceText,
	active = true,
}) {
	const db = getDB();

	const now = new Date();

	const medication = {
		_id: randomUUID(),
		userId,

		name,
		dosage,
		form,
		frequency,
		instructions,

		startDate: startDate ? new Date(startDate) : null,
		endDate: endDate ? new Date(endDate) : null,

		prescribedBy,
		sourceText,

		active,

		createdAt: now,
		updatedAt: now,
	};

	await db.collection("medications").insertOne(medication);

	return {
		success: true,
		medicationId: medication._id,
	};
}

export async function getMedications({ userId, active, limit = 50 }) {
	const db = getDB();

	const query = {
		userId,
	};

	if (active !== undefined) {
		query.active = active;
	}

	const medications = await db
		.collection("medications")
		.find(query)
		.sort({ createdAt: -1 })
		.limit(limit)
		.toArray();

	return {
		success: true,
		medications,
	};
}

export async function updateMedication({
	userId,
	medicationId,
	name,
	dosage,
	form,
	frequency,
	instructions,
	startDate,
	endDate,
	prescribedBy,
	sourceText,
	active,
}) {
	const db = getDB();

	const update = {
		updatedAt: new Date(),
	};

	if (name !== undefined) update.name = name;
	if (dosage !== undefined) update.dosage = dosage;
	if (form !== undefined) update.form = form;
	if (frequency !== undefined) update.frequency = frequency;
	if (instructions !== undefined) update.instructions = instructions;
	if (prescribedBy !== undefined) update.prescribedBy = prescribedBy;
	if (sourceText !== undefined) update.sourceText = sourceText;
	if (active !== undefined) update.active = active;

	if (startDate !== undefined) {
		update.startDate = startDate ? new Date(startDate) : null;
	}

	if (endDate !== undefined) {
		update.endDate = endDate ? new Date(endDate) : null;
	}

	const result = await db.collection("medications").updateOne(
		{
			_id: medicationId,
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

/* =========================
   SYMPTOMS
========================= */

export async function saveSymptom({
	userId,
	name,
	severity,
	description,
	startedAt,
	resolvedAt,
	status = "active",
	sourceText,
}) {
	const db = getDB();

	const now = new Date();

	const symptom = {
		_id: randomUUID(),
		userId,

		name,
		severity,
		description,

		startedAt: startedAt ? new Date(startedAt) : now,
		resolvedAt: resolvedAt ? new Date(resolvedAt) : null,

		status,

		sourceText,

		createdAt: now,
		updatedAt: now,
	};

	await db.collection("symptoms").insertOne(symptom);

	return {
		success: true,
		symptomId: symptom._id,
	};
}

export async function getSymptoms({ userId, status, name, limit = 50 }) {
	const db = getDB();

	const query = {
		userId,
	};

	if (status) {
		query.status = status;
	}

	if (name) {
		query.name = name;
	}

	const symptoms = await db
		.collection("symptoms")
		.find(query)
		.sort({ startedAt: -1 })
		.limit(limit)
		.toArray();

	return {
		success: true,
		symptoms,
	};
}

export async function updateSymptom({
	userId,
	symptomId,
	name,
	severity,
	description,
	startedAt,
	resolvedAt,
	status,
	sourceText,
}) {
	const db = getDB();

	const update = {
		updatedAt: new Date(),
	};

	if (name !== undefined) update.name = name;
	if (severity !== undefined) update.severity = severity;
	if (description !== undefined) update.description = description;
	if (status !== undefined) update.status = status;
	if (sourceText !== undefined) update.sourceText = sourceText;

	if (startedAt !== undefined) {
		update.startedAt = startedAt ? new Date(startedAt) : null;
	}

	if (resolvedAt !== undefined) {
		update.resolvedAt = resolvedAt ? new Date(resolvedAt) : null;
	}

	const result = await db.collection("symptoms").updateOne(
		{
			_id: symptomId,
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

/* =========================
   VITALS
========================= */

export async function saveVital({
	userId,
	type,
	value,
	unit,
	systolic,
	diastolic,
	timestamp,
	sourceText,
}) {
	const db = getDB();

	const vital = {
		_id: randomUUID(),
		userId,

		type,
		value,
		unit,

		systolic,
		diastolic,

		timestamp: new Date(timestamp || Date.now()),
		sourceText,

		createdAt: new Date(),
	};

	await db.collection("vitals").insertOne(vital);

	return {
		success: true,
		vitalId: vital._id,
	};
}

export async function getVitals({ userId, type, limit = 50 }) {
	const db = getDB();

	const query = {
		userId,
	};

	if (type) {
		query.type = type;
	}

	const vitals = await db
		.collection("vitals")
		.find(query)
		.sort({ timestamp: -1 })
		.limit(limit)
		.toArray();

	return {
		success: true,
		vitals,
	};
}

export async function updateVital({
	userId,
	vitalId,
	type,
	value,
	unit,
	systolic,
	diastolic,
	timestamp,
	sourceText,
}) {
	const db = getDB();

	const update = {};

	if (type !== undefined) update.type = type;
	if (value !== undefined) update.value = value;
	if (unit !== undefined) update.unit = unit;
	if (systolic !== undefined) update.systolic = systolic;
	if (diastolic !== undefined) update.diastolic = diastolic;
	if (sourceText !== undefined) update.sourceText = sourceText;

	if (timestamp !== undefined) {
		update.timestamp = new Date(timestamp);
	}

	const result = await db.collection("vitals").updateOne(
		{
			_id: vitalId,
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

/* =========================
   PRESCRIPTIONS
========================= */

export async function savePrescription({
	userId,
	doctorName,
	hospitalName,
	prescriptionDate,
	medications = [],
	instructions,
	documentUrl,
	sourceText,
}) {
	const db = getDB();

	const now = new Date();

	const prescription = {
		_id: randomUUID(),
		userId,

		doctorName,
		hospitalName,

		prescriptionDate: prescriptionDate ? new Date(prescriptionDate) : now,

		medications,
		instructions,

		documentUrl,
		sourceText,

		createdAt: now,
		updatedAt: now,
	};

	await db.collection("prescriptions").insertOne(prescription);

	return {
		success: true,
		prescriptionId: prescription._id,
	};
}

export async function getPrescriptions({ userId, limit = 20 }) {
	const db = getDB();

	const prescriptions = await db
		.collection("prescriptions")
		.find({ userId })
		.sort({ prescriptionDate: -1 })
		.limit(limit)
		.toArray();

	return {
		success: true,
		prescriptions,
	};
}

export async function updatePrescription({
	userId,
	prescriptionId,
	doctorName,
	hospitalName,
	prescriptionDate,
	medications,
	instructions,
	documentUrl,
	sourceText,
}) {
	const db = getDB();

	const update = {
		updatedAt: new Date(),
	};

	if (doctorName !== undefined) update.doctorName = doctorName;
	if (hospitalName !== undefined) update.hospitalName = hospitalName;
	if (medications !== undefined) update.medications = medications;
	if (instructions !== undefined) update.instructions = instructions;
	if (documentUrl !== undefined) update.documentUrl = documentUrl;
	if (sourceText !== undefined) update.sourceText = sourceText;

	if (prescriptionDate !== undefined) {
		update.prescriptionDate = prescriptionDate
			? new Date(prescriptionDate)
			: null;
	}

	const result = await db.collection("prescriptions").updateOne(
		{
			_id: prescriptionId,
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

/* =========================
   CONVERSATIONS
========================= */

export async function saveConversation({
	userId,
	sessionId,
	messages = [],
	startedAt,
	endedAt,
}) {
	const db = getDB();

	const now = new Date();

	const conversation = {
		_id: randomUUID(),
		userId,
		sessionId,

		messages,

		startedAt: startedAt ? new Date(startedAt) : now,
		endedAt: endedAt ? new Date(endedAt) : null,

		createdAt: now,
		updatedAt: now,
	};

	await db.collection("conversations").insertOne(conversation);

	return {
		success: true,
		conversationId: conversation._id,
	};
}

export async function getConversations({ userId, limit = 20 }) {
	const db = getDB();

	const conversations = await db
		.collection("conversations")
		.find({ userId })
		.sort({ startedAt: -1 })
		.limit(limit)
		.toArray();

	return {
		success: true,
		conversations,
	};
}

export async function updateConversation({
	userId,
	conversationId,
	messages,
	startedAt,
	endedAt,
}) {
	const db = getDB();

	const update = {
		updatedAt: new Date(),
	};

	if (messages !== undefined) {
		update.messages = messages;
	}

	if (startedAt !== undefined) {
		update.startedAt = startedAt ? new Date(startedAt) : null;
	}

	if (endedAt !== undefined) {
		update.endedAt = endedAt ? new Date(endedAt) : null;
	}

	const result = await db.collection("conversations").updateOne(
		{
			_id: conversationId,
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
