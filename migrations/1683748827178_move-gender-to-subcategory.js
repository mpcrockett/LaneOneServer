/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE categories DROP COLUMN gender;
    ALTER TABLE subcategories ADD COLUMN gender genderenum;
  `)
};

exports.down = pgm => {};
