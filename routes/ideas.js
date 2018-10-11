const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

module.exports = router;

//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');


router.get('/', (req, res) => {
	Idea.find({})
		.sort({date: 'desc'})
		.then(ideas => {
			res.render('ideas/index', {
				ideas: ideas
			})
		})
});

router.get('/add', (req, res) => {
	res.render('ideas/add');
});
// edit idea
router.get('/edit/:id', (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		res.render('ideas/edit',{
			idea: idea
		});
	});
	
});

router.post('/', (req, res) => {
	let errors = [];

	if (!req.body.title) {
		errors.push({text: 'Add a title'})
	}
	if (!req.body.details) {
		errors.push({text: 'Add details'})
	}
	if (errors.length > 0) {
		res.render('ideas/add', {
			errors: errors,
			title:  req.body.title,
			details: req.body.details
		})
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.details
		}
		new Idea(newUser)
			.save()
			.then(idea => {
				req.flash('success_msg', 'Idea added')
				res.redirect('/ideas');
			})
	}
} );

// edit form process
router.put('/:id', (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save()
			.then(idea => {
				req.flash('success_msg', 'Idea updated')
				res.redirect('/ideas')
			})
	})
});

router.delete('/:id', (req, res) => {
	Idea.deleteOne({
		_id: req.params.id
	})
	.then(() => {
		req.flash('success_msg', 'Video idea removed')
		res.redirect('/ideas')
	})
})