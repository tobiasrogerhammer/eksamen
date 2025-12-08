const router = require("express").Router();
const Meeting = require("./meetingSchema");
const {
  validateDateRange,
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
    if (!req.body.title || req.body.title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (req.body.title.length > 200) {
      return res
        .status(400)
        .json({ error: "Title is too long (max 200 characters)" });
    }

    if (!req.body.startTime || !req.body.endTime) {
      return res
        .status(400)
        .json({ error: "Start time and end time are required" });
    }

    const dateValidation = validateDateRange(
      req.body.startTime,
      req.body.endTime
    );
    if (!dateValidation.valid) {
      return res.status(400).json({ error: dateValidation.error });
    }

    if (!req.body.location || req.body.location.trim().length === 0) {
      return res.status(400).json({ error: "Location is required" });
    }

    if (!req.body.agenda || req.body.agenda.trim().length === 0) {
      return res.status(400).json({ error: "Agenda is required" });
    }

    const newMeeting = new Meeting({
      title: req.body.title.trim(),
      startTime: new Date(req.body.startTime),
      endTime: new Date(req.body.endTime),
      location: req.body.location.trim(),
      agenda: req.body.agenda.trim(),
      isCompleted: req.body.isCompleted || false,
    });

    const meeting = await newMeeting.save();
    res.status(201).json({
      message: "Meeting created successfully",
      meeting: meeting,
    });
  } catch (err) {
    console.error("Error creating meeting:", err);

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
      error: "Failed to create meeting",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    // Check database connection
    if (!checkDatabaseConnection()) {
      return res.status(503).json({
        error: "Database connection not available. Please try again later.",
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Meeting ID is required" });
    }

    const result = await Meeting.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    res.status(200).json({
      message: "Meeting deleted successfully",
      id: id,
    });
  } catch (err) {
    console.error("Error deleting meeting:", err);

    // Handle invalid ObjectId
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid meeting ID format" });
    }

    res.status(500).json({
      error: "Failed to delete meeting",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    // Check database connection
    if (!checkDatabaseConnection()) {
      return res.status(503).json({
        error: "Database connection not available. Please try again later.",
      });
    }

    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Meeting ID is required" });
    }

    const { isCompleted } = req.body;

    if (typeof isCompleted !== "boolean") {
      return res
        .status(400)
        .json({ error: "isCompleted must be a boolean value" });
    }

    const meeting = await Meeting.findByIdAndUpdate(
      id,
      { isCompleted },
      { new: true, runValidators: true }
    );

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    res.status(200).json({
      message: "Meeting updated successfully",
      meeting: meeting,
    });
  } catch (error) {
    console.error("Error updating meeting:", error);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid meeting ID format" });
    }

    res.status(500).json({
      error: "Failed to update meeting",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

router.get("/fetch", async (req, res) => {
  try {
    // Check database connection
    if (!checkDatabaseConnection()) {
      return res.status(503).json({
        error: "Database connection not available. Please try again later.",
      });
    }

    const meetings = await Meeting.find().sort({ startTime: 1 }); // Sort by start time
    res.status(200).json(meetings);
  } catch (err) {
    console.error("Error fetching meetings:", err);
    res.status(500).json({
      error: "Failed to fetch meetings",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = router;
