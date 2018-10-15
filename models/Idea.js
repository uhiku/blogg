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
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	status: {
		type: String,
		required: true
	},
	comments: [{
		commentBody: {
			type: String,
			required: true
		},
		commentDate: {
			type: Date,
			default: Date.now
		},
		commentUser: {
			type: Schema.Types.ObjectId,
			ref: 'users'
		}
	}],
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