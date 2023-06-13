const mongoose = require("mongoose");

const Record = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  mailadress: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Record", Record);
