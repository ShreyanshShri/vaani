import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGODB_URI, {
			serverSelectionTimeoutMS: 30000,
			socketTimeoutMS: 60000,
			maxPoolSize: 10,
			retryWrites: true,
			retryReads: true,
		});

		console.log(`MongoDB connected: ${connection.connection.host}`);
		// console.log(`Database: ${connection.connection.name}`);
	} catch (error) {
		console.error("MongoDB connection failed:", error.message);
		process.exit(1);
	}
};
