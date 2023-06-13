const mongoose = require("mongoose");

const Boat = new mongoose.Schema({
  Adresse: {
    type: String,
    required: false,
  },
  Postnummer: {
    type: Number,
    required: false,
  },
  Poststed: {
    type: String,
    required: false,
  },
  Båtplass: {
    type: Number,
    required: false,
  },
  startUse: {
    type: Date,
    required: false,
  },
  endUse: {
    type: Date,
    required: false,
  },
  mailadress: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Boat", Boat);
