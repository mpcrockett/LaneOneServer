/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE orders DROP COLUMN order_total;
    ALTER TABLE orders DROP COLUMN free_shipping;
  `)
};

exports.down = pgm => {};
