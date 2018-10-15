const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Cerate Schema

const IdeaSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	details: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	isComments: {
		type: Boolean,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('ideas', IdeaSchema);