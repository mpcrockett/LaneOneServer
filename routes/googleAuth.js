const express = require('express');
const passport = require('../middleware/authentication/googleAuth');
const googleAuthRouter = express.Router();

googleAuthRouter.post('/', passport.authenticate('google'));
googleAuthRouter.get('/oauth2/redirect', passport.authenticate('google', {
  successReturnToOrRedirect: 'http://localhost:5173/',
  failureRedirect: 'http://localhost:5173/login'
}));
googleAuthRouter.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = googleAuthRouter;