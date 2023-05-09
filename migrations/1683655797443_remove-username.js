/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE users DROP CONSTRAINT users_username_key;
    ALTER TABLE users DROP COLUMN username;
  `)
};

exports.down = pgm => {};
