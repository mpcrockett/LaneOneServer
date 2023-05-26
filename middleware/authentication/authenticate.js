const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function authenticate(req, res, next) {
  const token = req.session.token;
  const passport = req.session.passport;

  if(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(400).send('Invalid token.');
    }
  };

  if(passport) {
    if(passport.user.length > 0) {
      req.user = passport.user[0];
      return next();
    } else {
      return res.status(400).send('Invalid authentication.');
    }
  };

  return res.status(401).send('Access denied.');
};