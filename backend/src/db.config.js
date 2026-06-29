const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

let connectionPromise = null;

exports.connectDB = () => {
    if (mongoose.connection.readyState === 1) {
        return Promise.resolve();
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    if (!process.env.MONGO_URI) {
        return Promise.reject(new Error("MONGO_URI environment variable is missing."));
    }

    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 15000,
    }).then(() => {
        console.log("MongoDB Connected");
    }).catch((error) => {
        console.error("MongoDB Connection Failed:", error);
        connectionPromise = null;
        throw error;
    });

    return connectionPromise;
};