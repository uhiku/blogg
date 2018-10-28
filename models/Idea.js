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
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	status: {
		type: String,
		required: true
	},
	name: {
		type: String
	},
	avatar: {
		type: String
	},
	comments: [{
		commentBody: {
			type: String,
			required: true
		},
		commentName: {
			type: String
		},
		commentDate: {
			type: Date,
			default: Date.now
		},
		commentUser: {
			type: Schema.Types.ObjectId,
			ref: 'users'
		},
		avatar: {
			type: String
		}
	}],
	isComments: {
		type: Boolean,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	likes: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users'
			}
		}
	]
});

module.exports = Idea = mongoose.model('ideas', IdeaSchema);