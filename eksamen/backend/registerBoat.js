const express = require("express");
const router = express.Router();
const Boat = require("./boatSchema");

// Define a route for booking a dock spot
router.post("/createBoat", async (req, res) => {
  try {
    const boat = new Boat({
      Adresse: req.body.Adresse,
      Postnummer: req.body.Postnummer,
      Poststed: req.body.Poststed,
      Båtplass: req.body.Båtplass,
      startUse: req.body.startUse,
      endUse: req.body.endUse,
      mailadress: req.body.mailadress,
    });

    // Save the boat object to the database
    await boat.save();
    res.status(201).json({ message: "Boat registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register boat" });
  }
});
router.get("/seeBoats", async (req, res) => {
  try {
    const boatSpots = await Boat.find(
      {},
      { Båtplass: 1, _id: 1, startUse: 1, endUse: 1, mailadress: 1 }
    );
    res.status(200).json(boatSpots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch boat spots" });
  }
});
module.exports = router;
