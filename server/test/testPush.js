// import "../src/env.js";

const { connectMongo } = await import("../src/db/mongodb.js");

const { getUserPushSubscriptions } =
	await import("../src/reminders/pushRepository.js");

const { sendPushNotification } = await import("../src/reminders/push.js");

// console.log("MONGODB_URI:", process.env.MONGODB_URI);

await connectMongo();

const userId = "demo-user";

const subscriptions = await getUserPushSubscriptions(userId);

console.log("SUBSCRIPTIONS FOUND:", subscriptions.length);

for (const subscription of subscriptions) {
	console.log("SENDING PUSH TO:", subscription.endpoint);

	try {
		const result = await sendPushNotification(subscription, {
			type: "test",
			title: "Digital Nurse Test",
			message: "Push notification works!",
		});

		console.log("PUSH SENT:", result.statusCode);
	} catch (error) {
		console.error("PUSH FAILED:", error);
	}
}
