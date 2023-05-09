/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('products', {
    product_id: { type: 'serial', notNull: true, primaryKey: true },
    catagory_id: { type: 'integer'},
    description: { type: 'varchar(250)'},
  });
};

