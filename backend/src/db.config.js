const mongoose = require("mongoose");

// Disable buffering so queries fail fast if the connection is down, rather than hanging the serverless container
mongoose.set("bufferCommands", false);

exports.connectDB = async () => {
    // If already connected, use the existing connection
    if (mongoose.connection.readyState === 1) {
        console.log("Using existing MongoDB connection");
        return;
    }

    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is missing.");
        }
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 15000,        // Close socket after 15s of inactivity
        });
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        throw error;
    }
};

