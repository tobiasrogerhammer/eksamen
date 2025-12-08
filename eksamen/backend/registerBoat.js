const express = require("express");
const router = express.Router();
const Boat = require("./boatSchema");
const {
  validateEmail,
  validateDateRange,
  validatePostnummer,
  checkDatabaseConnection,
} = require("./utils/validators");

router.post("/createBoat", async (req, res) => {
  try {
    // Check database connection
    if (!checkDatabaseConnection()) {
      return res.status(503).json({
        error: "Database connection not available. Please try again later.",
      });
    }

    // Validate input
    if (!req.body.Adresse || req.body.Adresse.trim().length === 0) {
      return res.status(400).json({ error: "Address is required" });
    }

    const postnummerValidation = validatePostnummer(req.body.Postnummer);
    if (!postnummerValidation.valid) {
      return res.status(400).json({ error: postnummerValidation.error });
    }

    if (!req.body.Poststed || req.body.Poststed.trim().length === 0) {
      return res.status(400).json({ error: "Poststed is required" });
    }

    if (req.body.Båtplass === undefined || req.body.Båtplass === null) {
      return res.status(400).json({ error: "Båtplass is required" });
    }

    const båtplass = parseInt(req.body.Båtplass);
    if (isNaN(båtplass) || båtplass < 1) {
      return res
        .status(400)
        .json({ error: "Båtplass must be a positive number" });
    }

    if (!req.body.startUse || !req.body.endUse) {
      return res
        .status(400)
        .json({ error: "Start date and end date are required" });
    }

    const dateValidation = validateDateRange(
      req.body.startUse,
      req.body.endUse
    );
    if (!dateValidation.valid) {
      return res.status(400).json({ error: dateValidation.error });
    }

    const emailValidation = validateEmail(req.body.mailadress);
    if (!emailValidation.valid) {
      return res.status(400).json({ error: emailValidation.error });
    }

    // Check for overlapping reservations
    const startDate = new Date(req.body.startUse);
    const endDate = new Date(req.body.endUse);

    const existingBoat = await Boat.findOne({
      Båtplass: båtplass,
      $or: [
        {
          startUse: { $lte: endDate },
          endUse: { $gte: startDate },
        },
      ],
    });

    if (existingBoat) {
      return res.status(409).json({
        error: `Boat spot ${båtplass} is already reserved for this period`,
      });
    }

    const boat = new Boat({
      Adresse: req.body.Adresse.trim(),
      Postnummer: parseInt(req.body.Postnummer),
      Poststed: req.body.Poststed.trim(),
      Båtplass: båtplass,
      startUse: startDate,
      endUse: endDate,
      mailadress: req.body.mailadress.trim().toLowerCase(),
    });

    await boat.save();
    res.status(201).json({
      message: "Boat registered successfully",
      boat: boat,
    });
  } catch (error) {
    console.error("Error registering boat:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    res.status(500).json({
      error: "Failed to register boat",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

router.get("/seeBoats", async (req, res) => {
  try {
    // Check database connection
    if (!checkDatabaseConnection()) {
      return res.status(503).json({
        error: "Database connection not available. Please try again later.",
      });
    }

    const boatSpots = await Boat.find(
      {},
      {
        Båtplass: 1,
        _id: 1,
        startUse: 1,
        endUse: 1,
        mailadress: 1,
        Adresse: 1,
        Postnummer: 1,
        Poststed: 1,
      }
    ).sort({ Båtplass: 1 }); // Sort by Båtplass number

    res.status(200).json(boatSpots);
  } catch (error) {
    console.error("Error fetching boat spots:", error);
    res.status(500).json({
      error: "Failed to fetch boat spots",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
