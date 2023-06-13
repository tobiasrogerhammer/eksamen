const mongoose = require("mongoose");

const Meeting = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	startTime: {
		type: Date,
		required: true,
	},
	endTime: {
		type: Date,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	agenda: {
		type: String,
		required: true,
	},
	isCompleted: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("Meeting", Meeting);
