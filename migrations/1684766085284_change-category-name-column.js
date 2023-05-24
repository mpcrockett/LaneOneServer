/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  ALTER TABLE categories
  RENAME COLUMN name TO cat_name`)
};

exports.down = pgm => {};
