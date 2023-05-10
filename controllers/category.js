const Category = require('../models/Category')

module.exports = {
  async getProductCategories(req, res) {
    const response = await Category.getCategories();
    return res.status(200).send(response)
  }
}