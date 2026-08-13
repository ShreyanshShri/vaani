import { createReminderDocument } from "./reminderModel.js";
import { insertReminder } from "./reminderRepository.js";
import { reminderQueue } from "./reminderQueue.js";

export async function createAndScheduleReminder({
	userId,
	title,
	message,
	scheduledFor,
	timezone = "Asia/Kolkata",
}) {
	const date = new Date(scheduledFor);

	if (Number.isNaN(date.getTime())) {
		throw new Error("Invalid reminder date");
	}

	if (date.getTime() <= Date.now()) {
		throw new Error("Reminder time must be in the future");
	}

	const reminder = createReminderDocument({
		userId,
		title,
		message,
		scheduledFor: date,
		timezone,
	});

	const savedReminder = await insertReminder(reminder);

	await reminderQueue.add(
		"send-reminder",
		{
			reminderId: savedReminder._id.toString(),
		},
		{
			delay: date.getTime() - Date.now(),
			removeOnComplete: true,
			removeOnFail: false,
		},
	);

	return savedReminder;
}
