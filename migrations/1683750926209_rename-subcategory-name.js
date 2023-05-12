/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE subcategories
    RENAME COLUMN name to sub_name
  `)
};

exports.down = pgm => {};
