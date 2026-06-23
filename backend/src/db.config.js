const mongoose = require("mongoose");

exports.connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);

    } catch (error) {
        console.error(error);
        await mongoose.disconnect();
        process.exit(1);
    }
};