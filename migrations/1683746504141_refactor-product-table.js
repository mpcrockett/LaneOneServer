/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE products DROP CONSTRAINT products_catagory_id;
    ALTER TABLE products ADD COLUMN subcategory_id INTEGER REFERENCES subcategories(subcategory_id);
  `)
};

exports.down = pgm => {};
