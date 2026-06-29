const errorHandler = (err, req, res, next) => {
  console.error("Backend Error caught by middleware:", err.stack || err.message || err);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: "Duplicate field value entered." });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
