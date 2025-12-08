const router = require("express").Router();
const Record = require("./policeSchema");
const {
  validateEmail,
  validateUsername,
  checkDatabaseConnection,
} = require("./utils/validators");

router.post("/make", async (req, res) => {
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

    const emailValidation = validateEmail(req.body.mailadress);
    if (!emailValidation.valid) {
      return res.status(400).json({ error: emailValidation.error });
    }

    if (!req.body.date) {
      return res.status(400).json({ error: "Date is required" });
    }

    if (!req.body.reason || req.body.reason.trim().length === 0) {
      return res.status(400).json({ error: "Reason is required" });
    }

    // Validate date format
    const recordDate = new Date(req.body.date);
    if (isNaN(recordDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const newRecord = new Record({
      username: req.body.username.trim(),
      mailadress: req.body.mailadress.trim().toLowerCase(),
      date: recordDate,
      reason: req.body.reason.trim(),
    });

    const record = await newRecord.save();
    res.status(201).json({
      message: "Record created successfully",
      record: record,
    });
  } catch (err) {
    console.error("Error creating record:", err);

    // Handle duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        error: `${
          field === "username" ? "Username" : "Email"
        } already has a record`,
      });
    }

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
      error: "Failed to create record",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

router.get("/find", async (req, res) => {
  try {
    // Check database connection
    if (!checkDatabaseConnection()) {
      return res.status(503).json({
        error: "Database connection not available. Please try again later.",
      });
    }

    const records = await Record.find().sort({ date: -1 }); // Sort by date, newest first
    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).json({
      error: "Failed to fetch records",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = router;
