const LocalStrategy  = require('passport-local').Strategy;
const OAuth2Strategy  = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const keys = require('./keys');
const db = require('./database');

// Load users models
require('../models/User');
const User = mongoose.model('users');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = function(passport){

  //local strategy
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    // Match user
  //   User.findOne({
  //     email:email
  //   }).then(user => {
  //     if(!user){
  //       return done(null, false, {message: 'No User Found'});
  //   } 

  //     // Match password
  //     bcrypt.compare(password, user.password, (err, isMatch) => {
  //       if(err) throw err;
  //       if(isMatch){
  //         return done(null, user);
  //       } else {
  //         return done(null, false, {message: 'Password Incorrect'});
  //       }
  //     })
  //   })
   }));

  //Google strategy
  passport.use(
    new OAuth2Strategy({
      authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
      tokenURL: 'https://www.googleapis.com/oauth2/v3/token',
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: db.callbackURL,
      proxy: true
    },
      function(accessToken, refreshToken, profile, done, req, res) {
        //console.log(profile);
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

  //JWT Strategy
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
      .then(user => {
        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
  }))

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}