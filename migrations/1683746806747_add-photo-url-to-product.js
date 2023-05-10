/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE products ADD COLUMN url TEXT
  `)
};

exports.down = pgm => {};
