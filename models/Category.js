const pool = require('../db/index');

module.exports = class Category {
  static async getCategories() {
    const categoryData = await pool.query(`SELECT * FROM categories`);
    const response = categoryData.rows.reduce((acc, obj) => {
      const key = obj['gender'];
      const currGroup = acc[key] ?? [];
      return {...acc, [key]: [...currGroup, obj]}
    }, {});
    return response;
  }
};