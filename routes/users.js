const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const passport = require('passport');
const keys     = require('../config/keys');
const jwt      = require('jsonwebtoken');
const gravatar = require('gravatar');

//load input validation
const validateRegisterInput = require('../validator/registration');
const validateLoginInput = require('../validator/login');

//load model
require('../models/User');
const User = mongoose.model('users');



//user login

router.get('/login', (req, res) => {
	res.render('users/login')
})

//user register
router.get('/register', (req, res) => {
	res.render('users/register')
})

//Login from post
// router.post('/login', (req, res, next) => {
// 	passport.authenticate('local', {
// 		successRedirect: '/dashboard',
// 		failureRedirect: '/users/login',
// 		failureFlash: true
// 	})(req,res,next);
// })

// @desc Login user with JW Token

router.post('/login', (req, res) => {
	const {errors, isValid} = validateLoginInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({email})
		.then(user => {
			if (!user) {
				errors.email = 'User not found'
				return res.status(404).json(errors);
			}
			bcrypt.compare(password, user.password)
				.then(isMatch => {
					if (isMatch) {
						//if user is matched
						const payload = {
							id: user.id,
							name: user.name,
							avatar: user.image
						}
						jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
							res.json({success: true, token: 'Bearer ' + token})
						});
					} else {
						errors.password = 'Password incorrect'
						return res.status(400).json(errors)
					}
				})
		})
	})

//register
router.post('/register', (req, res) => {
	const {errors, isValid} = validateRegisterInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	//let errors = [];

	// if (req.body.password != req.body.password2) {
	// 	errors.push({text: 'Passwords do not match'})
	// }
	// if (req.body.password < 4) {
	// 	errors.push({text: 'Must be at least 4 characters'})
	// }
	// if (errors.length > 0) {
	// 	res.render('users/register', {
	// 		errors: errors,
	// 		name:  req.body.name,
	// 		email: req.body.email,
	// 		password: req.body.password,
	// 		password2: req.body.password2
	// 	})
	// } else {
		User.findOne({email: req.body.email})
			.then(user => {
				if(user){
					return res.status(400).json({email: 'Email already registered'})
				}else {
					const image = gravatar.url(req.body.email, {
						s: '200',
						r: 'pg',
						d: 'mm'
					})
					const newUser = new User({
						name: req.body.name,
						email: req.body.email,
						image,
						password: req.body.password
					});
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;
							newUser.password = hash;
							newUser.save()
							.then(user => res.json(user))
							.catch(err => {
								console.log(err);
								return;
							})
						});
					});
			}
		})
	//}
})

//logout
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
})

router.get('/currect', passport.authenticate('jwt', {session: false}), (req, res) => {
	res.json(req.user)
})

module.exports = router;