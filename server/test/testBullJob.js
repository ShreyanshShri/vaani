import "../src/env.js";
import { reminderQueue } from "../src/reminders/reminderQueue.js";

const reminderId = "6a7ccdb66e995e8b24e87f9b";

const job = await reminderQueue.add(
	"send-reminder",
	{
		reminderId,
	},
	{
		delay: 60_000,
		removeOnComplete: false,
		removeOnFail: false,
	},
);

console.log("JOB ADDED:", job.id);
console.log("REMINDER ID:", reminderId);
console.log("RUNS AT:", new Date(Date.now() + 60_000).toISOString());

process.exit(0);
