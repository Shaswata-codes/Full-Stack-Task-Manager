require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db.config.js");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Connect to Database
connectDB().catch((err) => {
  console.error("Database connection failed:", err);
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Task Manager Server is running!"
  });
});

// Middleware to ensure database is connected before processing API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/v1", require("./routes"));


app.use(errorHandler);

module.exports = app;
