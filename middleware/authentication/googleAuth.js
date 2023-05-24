const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost.8000/oauth2/redirect',
  scope: ['profile']
},
function verify(issuer, profile, cb) {
  //check the database for existing user with these credentials
  
}))