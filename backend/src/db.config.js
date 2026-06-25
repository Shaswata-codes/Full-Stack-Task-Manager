const mongoose = require("mongoose");

let dbError = null;

exports.connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is missing.");
        }
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);
        dbError = null;
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        dbError = error;
        throw error;
    }
};

exports.getDbError = () => dbError;
