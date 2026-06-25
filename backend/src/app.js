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

app.use("/api/v1", require("./routes"));

app.use(errorHandler);

module.exports = app;
