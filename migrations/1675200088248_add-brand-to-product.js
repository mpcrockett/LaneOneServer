/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql("ALTER TABLE products ADD COLUMN brand VARCHAR(50)");
};

