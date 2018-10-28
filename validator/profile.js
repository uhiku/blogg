const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateProfileInput(data) {
	let errors = {};

	data.handle = !isEmpty(data.handle) ? data.handle : '';
	data.status = !isEmpty(data.status) ? data.status : '';
	data.skills = !isEmpty(data.skills) ? data.skills : '';


	if (!validator.isLength(data.handle, {min: 2, max: 40})) {
		errors.handle = 'Handle must be between 2 and 40 characters'
	}
	if (validator.isEmpty(data.handle)) {
		errors.handle = 'Handle field is required'
	}
	if (validator.isEmpty(data.status)) {
		errors.status = 'Status field is required'
	}
	if (validator.isEmpty(data.skills)) {
		errors.skills = 'Skills field is required'
	}
	if (!isEmpty(data.website)) {
		if (!validator.isURL(data.website)) {
			errors.website = 'Not a valid URL'
		}
	}
	if (!isEmpty(data.twitter)) {
		if (!validator.isURL(data.twitter)) {
			errors.twitter = 'Not a valid URL'
		}
	}
	if (!isEmpty(data.youtube)) {
		if (!validator.isURL(data.youtube)) {
			errors.youtube = 'Not a valid URL'
		}
	}
	if (!isEmpty(data.facebook)) {
		if (!validator.isURL(data.facebook)) {
			errors.facebook = 'Not a valid URL'
		}
	}
	if (!isEmpty(data.linkedin)) {
		if (!validator.isURL(data.linkedin)) {
			errors.linkedin = 'Not a valid URL'
		}
	}
	if (!isEmpty(data.istagram)) {
		if (!validator.isURL(data.istagram)) {
			errors.istagram = 'Not a valid URL'
		}
	}
	if (!isEmpty(data.tumbler)) {
		if (!validator.isURL(data.tumbler)) {
			errors.tumbler = 'Not a valid URL'
		}
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
}