const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 👇 Add this line
app.use("/api/v1", require("./routes"));

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Task Manager Server is running!"
  });
});

module.exports = app;