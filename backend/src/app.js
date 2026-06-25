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

// Database connectivity check for all API routes
app.use((req, res, next) => {
  const mongoose = require("mongoose");
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      status: "error",
      message: "Database connection is not established. Please check if MONGO_URI environment variable is configured in Vercel settings."
    });
  }
  next();
});

app.use("/api/v1", require("./routes"));

app.use(errorHandler);

module.exports = app;
