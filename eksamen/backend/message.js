const mongoose = require("mongoose");

const Message = new mongoose.Schema({

	message: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	time: {
		type: Date,
		required: true,
	}
});
module.exports = mongoose.model("Message", Message);

