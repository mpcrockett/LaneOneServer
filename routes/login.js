const express = require('express');
const login = require('../controllers/login');
const loginRouter = express.Router();

// authenticates user
loginRouter.post('/', login.login);
loginRouter.delete('/', login.logout);

module.exports = loginRouter;