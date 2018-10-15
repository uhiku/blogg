const express    = require('express');
const router     = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');
const mongoose   = require('mongoose');

module.exports = router;
//load posts
require('../models/Idea');
require('../models/User');
const Idea = mongoose.model('ideas');

router.get('/', ensureAuthenticated, (req, res) => {
	Idea.find({
		email: req.user.email
	})
	.sort('desc')
	.then(ideas => {
		res.render('users/dashboard', {
			ideas: ideas
		})
	})
})

//add Idea
router.post('/', ensureAuthenticated, (req, res) => {
	let errors = [];

	if (!req.body.title) {
		errors.push({text: 'Add a title'})
	}
	if (!req.body.details) {
		errors.push({text: 'Add details'})
	}
	if (!req.body.status) {
		errors.push({text: 'Choose a status'})
	}
	if (errors.length > 0) {
		res.render('users/dashboard', {
			errors: errors,
			title:  req.body.title,
			details: req.body.details
		})
	} else {
		if (req.body.isComments ) {
			req.body.isComments = true
		} else {
			req.body.isComments = false
		}
		const newUser = {
			title: req.body.title,
			details: req.body.details,
			email: req.user.email,
			user: req.user.id,
			status: req.body.status,
			isComments: req.body.isComments
		}
		new Idea(newUser)
			.save()
			.then(idea => {
				req.flash('success_msg', 'Idea added')
				res.redirect('/dashboard');
			})
	}
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		if (idea.user != req.user.id) {
			req.flash('error_msg', 'Not Authorized!');
			res.redirect('/dashboard');
		} else {
			res.render('ideas/edit', {
				idea: idea
			})
		}
	})
})

router.put('/edit/:id', ensureAuthenticated,  (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save()
			.then(idea => {
				res.render('/edit', {idea: idea});
				req.flash('success_msg', 'Idea updated')
				res.redirect('/dashboard')
			})
	})
});
router.delete('/:id', ensureAuthenticated, (req, res) => {
	Idea.deleteOne({
		_id: req.params.id
	})
	.then(() => {
		req.flash('success_msg', 'Idea has been deleted');
		res.redirect('/dashboard')
	})
} )