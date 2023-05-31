/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE addresses 
    RENAME COLUMN street_address_1 TO street_address_one;
    ALTER TABLE addresses 
    RENAME COLUMN street_address_2 TO street_address_two;
  `)
};

exports.down = pgm => {};
