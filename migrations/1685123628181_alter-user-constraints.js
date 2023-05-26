/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE users
    ALTER COLUMN password DROP NOT NULL;
  `)
};

exports.down = pgm => {};
