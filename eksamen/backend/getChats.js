const router = require("express").Router();
const Message = require("./message");
const {
  validateUsername,
  checkDatabaseConnection,
} = require("./utils/validators");

router.post("/create", async (req, res) => {
  try {
    // Check database connection
    if (!checkDatabaseConnection()) {
      return res.status(503).json({
        error: "Database connection not available. Please try again later.",
      });
    }

    // Validate input
    const usernameValidation = validateUsername(req.body.username);
    if (!usernameValidation.valid) {
      return res.status(400).json({ error: usernameValidation.error });
    }

    if (!req.body.message || req.body.message.trim().length === 0) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    if (req.body.message.length > 1000) {
      return res
        .status(400)
        .json({ error: "Message is too long (max 1000 characters)" });
    }

    if (!req.body.time) {
      return res.status(400).json({ error: "Time is required" });
    }

    const newMessage = new Message({
      message: req.body.message.trim(),
      username: req.body.username.trim(),
      time: new Date(req.body.time),
    });

    const message = await newMessage.save();
    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (err) {
    console.error("Error creating message:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: Object.values(err.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    res.status(500).json({
      error: "Failed to send message",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

router.get("/messages", async (req, res) => {
  try {
    // Check database connection
    if (!checkDatabaseConnection()) {
      return res.status(503).json({
        error: "Database connection not available. Please try again later.",
      });
    }

    const messages = await Message.find().sort({ time: 1 }); // Sort by time, oldest first
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({
      error: "Failed to fetch messages",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = router;
