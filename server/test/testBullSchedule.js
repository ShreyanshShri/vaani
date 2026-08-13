import { reminderQueue } from "../src/reminders/reminderQueue.js";

const reminderId = "6a7ccdb66e995e8b24e87f9b";

const runAt = new Date(Date.now() + 60_000);

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

console.log("========== BULLMQ TEST ==========");

console.log("JOB ID:", job.id);
console.log("JOB NAME:", job.name);
console.log("JOB DATA:", job.data);
console.log(
	"RUN AT:",
	runAt.toLocaleString("en-IN", {
		timeZone: "Asia/Kolkata",
	}),
);
