const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

module.exports = router;

//load helper
const {ensureAuthenticated} = require('../helpers/auth');

//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');


router.get('/', ensureAuthenticated, (req, res) => {
	Idea.find({user: req.user.id})
		.sort({date: 'desc'})
		.then(ideas => {
			res.render('ideas/index', {
				ideas: ideas
			})
		})
});

router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('ideas/add');
});

