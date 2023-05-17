require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db/index');
const User = require('../models/User');

module.exports = {
  async login(req, res) {
    const user = new User(req.body);
    const validPassword = await user.validateUserPassword();

    if(validPassword) {
      const user_id = await user.getUserByEmail();
      const token = await user.generateUserAccessToken();
      req.session.token = token;
      const response = {...user }
      delete response.password;
      delete response.new_password;
      return res.status(200).send(response);
    } 

    return res.status(401).send("Invalid username or password.");
  },

  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) return res.status(400).send('Unable to log out')
    });
    return res.status(200).send('Logout successful');
  }
};

