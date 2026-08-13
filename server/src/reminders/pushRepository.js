import { getDB } from "../db/mongodb.js";

export async function savePushSubscription(userId, subscription) {
	const db = getDB();

	const subscriptions = db.collection("pushSubscriptions");

	await subscriptions.updateOne(
		{
			userId,
			endpoint: subscription.endpoint,
		},
		{
			$set: {
				userId,
				endpoint: subscription.endpoint,
				keys: subscription.keys,
				updatedAt: new Date(),
			},
			$setOnInsert: {
				createdAt: new Date(),
			},
		},
		{
			upsert: true,
		},
	);
}

export async function getUserPushSubscriptions(userId) {
	const db = getDB();

	return db.collection("pushSubscriptions").find({ userId }).toArray();
}

export async function deletePushSubscription(endpoint) {
	const db = getDB();

	return db.collection("pushSubscriptions").deleteOne({ endpoint });
}
