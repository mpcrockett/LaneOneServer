const Category = require('../models/Category')

module.exports = {
  async getProductCategories(req, res) {
    try {
      const response = await Category.getCategories();
      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send({ Error: error.message })
    }
  }  
}