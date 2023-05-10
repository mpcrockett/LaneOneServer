const express = require('express');
const category = require('../controllers/category')
const categoryRouter = express.Router();

categoryRouter.get('/', category.getProductCategories);

module.exports = categoryRouter;