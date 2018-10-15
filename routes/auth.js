const express    = require('express');
const router     = express.Router();
const passport   = require('passport');
const mongoose = require('mongoose');

require('../models/User');
const User = mongoose.model('users');


router.get('/google', passport.authenticate('google', {
	scope: ['profile',  'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/user/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });
module.exports = router;