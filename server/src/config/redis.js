import { createClient } from "redis";

let redisClient = null;
let isConnected = false;

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export async function connectRedis() {
	try {
		redisClient = createClient({
			url: redisUrl,
			socket: {
				connectTimeout: 5000,
				reconnectStrategy: (retries) => {
					// Maximum reconnect delay of 3 seconds, limit retries to not print infinite logs
					if (retries > 5) {
						console.warn("Redis: Max reconnect attempts reached. Caching disabled.");
						isConnected = false;
						return false; // stop reconnecting
					}
					return Math.min(retries * 500, 3000);
				}
			}
		});

		redisClient.on("error", (err) => {
			console.error("Redis error:", err.message);
			isConnected = false;
		});

		redisClient.on("connect", () => {
			console.log("Redis: Connecting...");
		});

		redisClient.on("ready", () => {
			console.log("Redis: Client is ready and connected");
			isConnected = true;
		});

		redisClient.on("end", () => {
			console.log("Redis: Connection closed");
			isConnected = false;
		});

		await redisClient.connect();
	} catch (error) {
		console.error("Redis connection failed. Running without cache:", error.message);
		isConnected = false;
		redisClient = null;
	}
}

export function isRedisConnected() {
	return isConnected && redisClient !== null;
}

export async function getCache(key) {
	if (!isRedisConnected()) return null;
	try {
		const value = await redisClient.get(key);
		if (value) {
			return JSON.parse(value);
		}
		return null;
	} catch (error) {
		console.error(`Redis get error for key ${key}:`, error.message);
		return null;
	}
}

export async function setCache(key, value, ttlSeconds = 3600) {
	if (!isRedisConnected()) return false;
	try {
		const serialized = JSON.stringify(value);
		await redisClient.set(key, serialized, {
			EX: ttlSeconds,
		});
		return true;
	} catch (error) {
		console.error(`Redis set error for key ${key}:`, error.message);
		return false;
	}
}

export async function deleteCache(key) {
	if (!isRedisConnected()) return false;
	try {
		await redisClient.del(key);
		return true;
	} catch (error) {
		console.error(`Redis delete error for key ${key}:`, error.message);
		return false;
	}
}

export async function deleteCacheByPattern(pattern) {
	if (!isRedisConnected()) return false;
	try {
		const keys = await redisClient.keys(pattern);
		if (keys.length > 0) {
			await redisClient.del(keys);
		}
		return true;
	} catch (error) {
		console.error(`Redis delete pattern error for ${pattern}:`, error.message);
		return false;
	}
}
