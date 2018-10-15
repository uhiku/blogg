const express     = require('express');
const router      = express.Router();
const mongoose    = require('mongoose');

module.exports = router;

require('../models/Idea');
const Idea = mongoose.model('ideas');

//loading posts
router.get('/', (req, res) => {
	Idea.find({
		status: 'public'
	})
	.populate('user')
	.sort('desc')
	.then(ideas => {
		//if (idea.user == req.user.id) {} else {}
		res.render('ideas/public', {
			ideas: ideas
		})
	})
})






//rendering views