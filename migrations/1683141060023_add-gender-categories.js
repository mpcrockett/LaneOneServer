/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
  CREATE TYPE genderEnum AS ENUM ('men', 'women', 'unisex');
  ALTER TABLE categories ADD COLUMN gender genderEnum;
  `)
};

exports.down = pgm => {};
