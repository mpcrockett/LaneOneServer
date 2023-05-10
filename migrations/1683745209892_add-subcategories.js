/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  CREATE TABLE subcategories (
    subcategory_id SERIAL PRIMARY KEY,
    name VARCHAR(80),
    category_id integer REFERENCES categories(category_id)
  );
  `)
};

exports.down = pgm => {};
