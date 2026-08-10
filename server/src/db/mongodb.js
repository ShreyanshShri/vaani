import "../env.js";
import { MongoClient } from "mongodb";

console.log(process.env.MONGODB_URI);
const client = new MongoClient(process.env.MONGODB_URI);

let db;

export async function connectMongo() {
	console.log("Connecting to mongodb");
	await client.connect();

	db = client.db(process.env.MONGODB_DB);

	console.log("MongoDB connected");
}

export function getDB() {
	if (!db) {
		throw new Error("MongoDB not connected");
	}

	return db;
}
