const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateIdeaInput(data) {
	let errors = {};

	data.commentBody = !isEmpty(data.commentBody) ? data.commentBody : '';

	if (!validator.isLength(data.commentBody, {min: 10, max: 350})) {
		errors.commentBody = 'Your comment must be between 10 and 150 characters'
	}
	if (validator.isEmpty(data.commentBody)) {
		errors.commentBody = 'Comment it!'
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
}