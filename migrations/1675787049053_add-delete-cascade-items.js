/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE items
    DROP CONSTRAINT items_product_id_foreign_key,
    ADD CONSTRAINT items_product_id_foreign_key
      FOREIGN KEY (product_id)
      REFERENCES products(product_id)
      ON DELETE CASCADE;`
  );
};

