const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function authenticate(req, res, next) {
  const token = req.session.token;
  const passport = req.session.passport;
  console.log(passport);

  if(passport) {
    req.user = passport.user;
    next();
  } else if(token) {
      try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        req.user = decoded;
        next();
      } catch (ex) {
        res.status(400).send('Invalid token.');
      }
  } else {
    return res.status(401).send('Access denied.')
  };
  
};