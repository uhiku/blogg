const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Cerate Schema

const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		default: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('users', UserSchema);