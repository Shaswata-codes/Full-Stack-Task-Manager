const mongoose = require("mongoose");

// Disable buffering so queries fail fast if the connection is down, rather than hanging the serverless container
mongoose.set("bufferCommands", false);

let connectionPromise = null;

exports.connectDB = () => {
    // If already connected, return resolved promise
    if (mongoose.connection.readyState === 1) {
        return Promise.resolve();
    }

    // If connection is in progress, return the existing promise
    if (connectionPromise) {
        return connectionPromise;
    }

    if (!process.env.MONGO_URI) {
        return Promise.reject(new Error("MONGO_URI environment variable is missing."));
    }

    // Cache the connection promise
    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 15000,        // Close socket after 15s of inactivity
    }).then(() => {
        console.log("MongoDB Connected");
    }).catch((error) => {
        console.error("MongoDB Connection Failed:", error);
        connectionPromise = null; // Clear cache on failure so next request can retry
        throw error;
    });

    return connectionPromise;
};


