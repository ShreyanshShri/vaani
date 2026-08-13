import "../env.js";
import { MongoClient } from "mongodb";

console.log(process.env.MONGODB_URI);
// const client = new MongoClient(process.env.MONGODB_URI);
const client = new MongoClient("mongodb://localhost:27017");

let db;

export async function connectMongo() {
	// console.log("Connecting to mongodb");
	await client.connect();

	// db = client.db(process.env.MONGODB_DB || "mongodb://localhost:27017");
	db = client.db("digital_nurse");

	await db
		.collection("medical_events")
		.createIndex({ userId: 1, type: 1, timestamp: -1 });

	console.log("MongoDB connected");
}

export function getDB() {
	if (!db) {
		throw new Error("MongoDB not connected");
	}

	return db;
}
