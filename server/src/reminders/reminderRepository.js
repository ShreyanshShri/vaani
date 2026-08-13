import { ObjectId } from "mongodb";
import { getDB } from "../db/mongodb.js";

export async function insertReminder(reminder) {
	const db = getDB();

	const result = await db.collection("reminders").insertOne(reminder);

	return {
		...reminder,
		_id: result.insertedId,
	};
}

export async function getReminderById(reminderId) {
	const db = getDB();

	return db.collection("reminders").findOne({
		_id: new ObjectId(reminderId),
	});
}

export async function getUserReminders(userId) {
	const db = getDB();

	return db
		.collection("reminders")
		.find({ userId })
		.sort({ scheduledFor: 1 })
		.toArray();
}

export async function markReminderCompleted(reminderId) {
	const db = getDB();

	return db.collection("reminders").updateOne(
		{
			_id: new ObjectId(reminderId),
		},
		{
			$set: {
				status: "completed",
				updatedAt: new Date(),
			},
		},
	);
}
