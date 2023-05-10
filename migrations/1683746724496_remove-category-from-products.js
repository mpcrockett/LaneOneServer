/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE products DROP COLUMN category_id
  `)
};

exports.down = pgm => {};
