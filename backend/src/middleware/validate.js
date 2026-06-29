const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Name is required." });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required." });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  next();
};

const validateTask = (req, res, next) => {
  const { title, priority } = req.body;

  if (req.method === "POST" && (!title || !title.trim())) {
    return res.status(400).json({ message: "Task title is required." });
  }

  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ message: "Task title cannot be empty." });
  }

  if (priority && !["Low", "Medium", "High"].includes(priority)) {
    return res.status(400).json({ message: "Priority must be Low, Medium, or High." });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTask,
};
