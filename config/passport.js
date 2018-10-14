const LocalStrategy  = require('passport-local').Strategy;
const OAuth2Strategy  = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const keys = require('./keys');

// Load user model
require('../models/User');
const User = mongoose.model('users');

module.exports = function(passport){

  //local strategy
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    // Match user
    User.findOne({
      email:email
    }).then(user => {
      if(!user){
        return done(null, false, {message: 'No User Found'});
    } 

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Password Incorrect'});
        }
      })
    })
  }));

  //Google strategy
  passport.use(
    new OAuth2Strategy({
      authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
      tokenURL: 'https://www.googleapis.com/oauth2/v3/token',
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: 'http://localhost.ua:5000/auth/google/callback',
      proxy: true
    },
      function(accessToken, refreshToken, profile, done) {
        const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
        const newUser = {
          googleID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          image: image,
          name: profile.name.givenName
        }

        //check if user is logged
        User.findOne({
          googleID: profile.id
        }).then(user => {
          if (user) {
            done(null, user)
          } else {
            new User(newUser)
              .save()
              .then(user => done(null, user))
          }
        })
      }
    ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}