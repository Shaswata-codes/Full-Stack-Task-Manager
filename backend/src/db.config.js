const mongoose = require("mongoose");

exports.connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is missing.");
        }
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);

    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        throw error;
    }
};