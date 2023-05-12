/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  ALTER TABLE subcategories
  ADD COLUMN slug VARCHAR(20)`)
};

exports.down = pgm => {};
