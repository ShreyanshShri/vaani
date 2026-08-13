import express from "express";

import { savePushSubscription } from "../reminders/pushRepository.js";

const router = express.Router();

const USER_ID = "demo-user";

router.post("/subscribe", async (req, res) => {
	try {
		const subscription = req.body;

		if (!subscription || !subscription.endpoint || !subscription.keys) {
			return res.status(400).json({
				error: "Invalid push subscription",
			});
		}

		await savePushSubscription(USER_ID, subscription);

		res.json({
			success: true,
		});
	} catch (error) {
		console.error("Push subscription error:", error);

		res.status(500).json({
			success: false,
			error: "Failed to save push subscription",
		});
	}
});

export default router;
