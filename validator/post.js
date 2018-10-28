const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateIdeaInput(data) {
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : '';
	data.details = !isEmpty(data.details) ? data.details : '';

	if (!validator.isLength(data.details, {min: 10, max: 350})) {
		errors.details = 'Your idea must be between 10 and 350 characters'
	}
	if (validator.isEmpty(data.title)) {
		errors.title = 'Title field is required'
	}
	if (validator.isEmpty(data.details)) {
		errors.details = 'Your idea cannot be empty'
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
}