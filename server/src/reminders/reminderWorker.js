import { Worker } from "bullmq";

import { redisConnection } from "./reminderQueue.js";

import {
	getReminderById,
	markReminderCompleted,
} from "./reminderRepository.js";

import {
	getUserPushSubscriptions,
	deletePushSubscription,
} from "./pushRepository.js";

import { sendPushNotification } from "./push.js";

export const reminderWorker = new Worker(
	"reminders",

	async (job) => {
		console.log("========== BULLMQ JOB RECEIVED ==========");

		console.log("JOB ID:", job.id);
		console.log("JOB NAME:", job.name);
		console.log("JOB DATA:", job.data);

		const { reminderId } = job.data;

		const reminder = await getReminderById(reminderId);

		console.log("REMINDER:", reminder);

		if (!reminder) {
			throw new Error(`Reminder not found: ${reminderId}`);
		}

		if (reminder.status !== "scheduled") {
			throw new Error(`Reminder status is ${reminder.status}`);
		}

		const subscriptions = await getUserPushSubscriptions(reminder.userId);

		console.log("PUSH SUBSCRIPTIONS:", subscriptions.length);

		if (subscriptions.length === 0) {
			throw new Error(`No push subscriptions for user ${reminder.userId}`);
		}

		const payload = {
			type: "reminder",
			reminderId: reminder._id.toString(),
			title: reminder.title,
			message: reminder.message,
		};

		for (const subscription of subscriptions) {
			try {
				const result = await sendPushNotification(subscription, payload);

				console.log("PUSH SENT:", result.statusCode);
			} catch (error) {
				console.error("PUSH FAILED:", error);

				if (error.statusCode === 404 || error.statusCode === 410) {
					await deletePushSubscription(subscription.endpoint);
				}

				throw error;
			}
		}

		await markReminderCompleted(reminderId);

		console.log("REMINDER MARKED COMPLETED");
	},

	{
		connection: redisConnection,
	},
);

reminderWorker.on("ready", () => {
	console.log("========== REMINDER WORKER READY ==========");
});

reminderWorker.on("completed", (job) => {
	console.log(`========== REMINDER COMPLETED: ${job.id} ==========`);
});

reminderWorker.on("failed", (job, error) => {
	console.error(`========== REMINDER FAILED: ${job?.id} ==========`);

	console.error(error);
});
