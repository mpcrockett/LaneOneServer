const pool = require('../db/index');

module.exports = class Category {
  // static async getCategories() {
  //   const categoryData = await pool.query(`
  //     SELECT * FROM subcategories JOIN categories
  //     ON subcategories.category_id = categories.category_id;
  //   `);
  //   const response = categoryData.rows.reduce((acc, obj) => {
  //     const key = obj['gender'];
  //     const currGroup = acc[key] ?? [];
  //     return {...acc, [key]: [...currGroup, obj]}
  //   }, {});
  //   return response;
  // }

  static async getCategories() {
    const genderEnum = ['women', 'men', 'unisex'];
    const response = genderEnum.map((x) => {
      return pool.query(`SELECT * FROM subcategories
        JOIN categories
        ON subcategories.category_id = categories.category_id
        WHERE gender = $1`, [x]);
    });
    const awaitedResults = await Promise.all(response);
    const results = awaitedResults.map((r) => {
      const reducedResults = r.rows.reduce((acc, obj) => {
        const key = obj['name'];
        const currGroup = acc[key] ?? [];
        return {...acc, [key]: [...currGroup, obj]}
      }, {});
      return { [r.rows[0].gender]: reducedResults }
    });
    return { ...results[0], ...results[1], ...results[2] }
  }
};