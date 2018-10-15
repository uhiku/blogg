const moment          = require('moment');
module.exports = {
	truncate: function(str, len) {
		if (str.length > len && str.length > 0) {
			let new_str = str + ' ';
			new_str = str.substr(0, len);
			new_str = str.substr(0, new_str.lastIndexOf(0, len));
			new_str = (new_str.lendth > 0) ? new_str : str.substr(0, len);
			return new_str + '...';
		} else {
			return str;
		}
	},
	stripTags: function(input) {
		return input.replace(/<(?:.|\n)*?>/gm, '');
	},
	formatDate: function(date, format) {
		return moment(date).format(format)
	},
	publicToPrivate: function(postUserID, sessionUserId, id) {
		if (sessionUserId == postUserID) {
			return `<a href="/dashboard/edit/${id}" class="ml-auto"><i class="fas fa-edit"></i></a>`
		} else {
			return ''
		}
	}
}