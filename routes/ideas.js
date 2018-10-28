const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');



//load helper
const {ensureAuthenticated} = require('../helpers/auth');

//Load Idea Model

const Idea = require('../models/Idea');
const Profile = require('../models/Profile');
const validateIdeaInput = require('../validator/post');
const validateCommentInput = require('../validator/comment');

router.get('/', (req, res) => {
	Idea.find()
		.sort({date: -1})
		.then(ideas => res.json(ideas))
		.catch(err => res.status(404).json({nopostsfound: 'no posts'}))
});

router.get('/:id', (req, res) => {
	Idea.findById(req.params.id)
		.sort({date: -1})
		.then(idea => res.json(idea))
		.catch(err => res.status(404).json({nopostfound: 'no post with that ID'}))
});

router.post('/add', passport.authenticate('jwt', { session: false}), (req, res) => {
	const {errors, isValid} = validateIdeaInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors)
	}
	if (!req.body.isComments) {
		req.body.isComments = false
	} else {
		req.body.isComments = true
	}
	const newIdea = new Idea ({
		title: req.body.title,
		details: req.body.details,
		avatar: req.body.avatar,
		user: req.user.id,
		name: req.body.name,
		isComments: req.body.isComments,
		status: req.body.status
	})
	newIdea.save().then(ideas => res.json(ideas))
});

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Idea.findById(req.params.id)
        .then(idea => {
          // Check for post owner
          if (idea.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete
          idea.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Idea.findById(req.params.id)
        .then(idea => {
          if (idea.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
          	return res.status(400).json({alreadyliked: 'already liked'})
          } else {
          	idea.likes.unshift({user: req.user.id})
          	idea.save().then(idea => res.json({success: true}))
          }
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Idea.findById(req.params.id)
        .then(idea => {
          if (
            idea.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: 'You have not yet liked this post' });
          }

          // Get remove index
          const removeIndex = idea.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          idea.likes.splice(removeIndex, 1);

          // Save
          idea.save().then(idea => res.json(idea));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);


router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const {errors, isValid} = validateCommentInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors)
	}
	Idea.findById(req.params.id)
		.then(idea => {
			const newComment = {
				commentBody: req.body.commentBody,
				avatar: req.body.avatar,
				commentUser: req.user.id
			}
			idea.comments.unshift(newComment)
			idea.save().then(idea => res.json(idea))
		})
		.catch(err => res.status(404).json({postnotfound: 'No post found'}))
});

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Idea.findById(req.params.id)
		.then(idea => {
			if (idea.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
				return res.status(404).json({commentnotexist: 'Comment does not exist'});
			}
			const removeIndex = idea.comments
				.map(item => item._id.toString())
				.indexOf(req.params.comment_id);
			idea.comments.splice(removeIndex, 1);
			idea.save().then(idea => res.json(idea));
		})
		.catch(err => res.status(404).json({postnotfound: 'No post found'}))
});

module.exports = router;