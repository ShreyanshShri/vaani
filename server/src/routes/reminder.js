import express from "express";
import { MongoClient } from "mongodb";

const router = express.Router();

const client = new MongoClient("mongodb://localhost:27017");

router.get("/", async (req, res) => {
	console.log("Fetching reminders");
	try {
		const userId = "test-user-001";

		await client.connect();

		const db = client.db("digital_nurse");

		const reminders = await db
			.collection("reminders")
			.find({ userId })
			.sort({ scheduledFor: 1 })
			.toArray();

		res.json({
			reminders,
		});
	} catch (error) {
		console.error("GET REMINDERS ERROR:", error);

		res.status(500).json({
			error: "Failed to fetch reminders",
		});
	}
});

export default router;
