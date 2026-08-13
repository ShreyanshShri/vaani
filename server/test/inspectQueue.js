import { reminderQueue } from "../src/reminders/reminderQueue.js";

const counts = await reminderQueue.getJobCounts();

console.log("\n========== QUEUE COUNTS ==========");
console.log(counts);

const waiting = await reminderQueue.getWaiting();
const active = await reminderQueue.getActive();
const delayed = await reminderQueue.getDelayed();
const completed = await reminderQueue.getCompleted();
const failed = await reminderQueue.getFailed();

console.log("\n========== WAITING ==========");
for (const job of waiting) {
	console.log({
		id: job.id,
		name: job.name,
		data: job.data,
	});
}

console.log("\n========== ACTIVE ==========");
for (const job of active) {
	console.log({
		id: job.id,
		name: job.name,
		data: job.data,
	});
}

console.log("\n========== DELAYED ==========");
for (const job of delayed) {
	console.log({
		id: job.id,
		name: job.name,
		data: job.data,
	});
}

console.log("\n========== COMPLETED ==========");
for (const job of completed) {
	console.log({
		id: job.id,
		name: job.name,
		data: job.data,
		finishedOn: job.finishedOn,
	});
}

console.log("\n========== FAILED ==========");
for (const job of failed) {
	console.log({
		id: job.id,
		name: job.name,
		data: job.data,
		failedReason: job.failedReason,
	});
}

process.exit(0);
