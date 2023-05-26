/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE users
    ADD COLUMN google_id VARCHAR(100),
    ADD COLUMN provider VARCHAR(100);
  `)
};

exports.down = pgm => {};
