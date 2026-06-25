require("dotenv").config({
    path : '.env'
});

require("colors");

const app = require("./src/app.js");
const { connectDB } = require("./src/db.config.js");

const port = process.env.PORT || 1234;

connectDB().catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
});

app.use("/api/v1", require("./src/routes"));

app.use(require("./src/middleware/errorHandler"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});