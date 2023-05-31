const pool = require('../db/index');
const Address = require("../models/Address");
const Cart = require("../models/Cart");

module.exports = class Order {
  constructor(obj) {
    this.order_id = obj.order_id;
    this.user_id = obj.user_id;
    this.address_id = obj.address_id;
    this.items = obj.items;
    this.order_status = obj.order_status;
  }
  
  async createNewOrder() {
    const client = await pool.connect();
    let success;
    try {
      await client.query('BEGIN');
      const newOrder = await client.query("INSERT INTO orders (user_id, address_id) VALUES($1, $2) RETURNING order_id",
      [this.user_id, this.address_id]);
      this.order_id = newOrder.rows[0].order_id;
      this.items.map(obj => client.query("INSERT INTO orders_items (order_id, item_id, quantity) VALUES ($1, $2, $3)", [this.order_id, obj.item_id, obj.quantity]));
      //updating inventory numbers
      this.items.map(obj => client.query("UPDATE items SET number_in_stock = number_in_stock - $1 WHERE item_id = $2", [obj.quantity, obj.item_id]));
      await client.query('COMMIT');
      success = true;
    } catch (e) {
      await client.query('ROLLBACK');
      await client.query("DELETE FROM addresses WHERE address_id = $1", [this.address_id]);
      success = false;
    } finally {
      client.release();
      return success;
    };
  };
  
  static async getOrderByOrderId(id) {
    const returnObj = {};
    let order = await pool.query(`SELECT orders.order_id, orders.address_id, orders_items.quantity,
    products.name, products.brand, products.gender, products.price, products.product_id, products.url, orders.order_status, items.size, items.color, items.item_id
    FROM orders JOIN addresses ON orders.address_id = addresses.address_id
    JOIN orders_items ON orders.order_id = orders_items.order_id
    JOIN items ON orders_items.item_id = items.item_id
    JOIN products ON items.product_id = products.product_id
    WHERE orders.order_id = $1`, [id]
    );
    const result = order.rows;
    if(result.length === 0) return false;
    returnObj.order_id = id;
    returnObj.address_id = result[0].address_id;
    returnObj.order_status = result[0].order_status;
    returnObj.items = result.map((item) =>  {
      return { 
        item_id: item.item_id,
        product_id: item.product_id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        gender: item.gender,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        url: item.url
      } 
    });
    return returnObj;
  };
  
  static async getOrderStatusById(order_id) {
    const order =  await pool.query("SELECT order_status FROM orders WHERE order_id = $1", [order_id]);
    const { order_status } = order.rows[0];
    return order_status;
  };
  
  static async cancelOrderById(order_id) {
    const client = await pool.connect();
    let success;
    try {
      await client.query('BEGIN');
      const order = await client.query(
        `SELECT orders.order_id, orders_items.quantity, orders_items.item_id FROM orders
        JOIN orders_items ON orders.order_id = orders_items.order_id
        JOIN items ON orders_items.item_id = items.item_id
        WHERE orders.order_id = $1`, [order_id]
        );
        await client.query("UPDATE orders SET order_status = $1 WHERE order_id = $2", ['canceled', order_id]);
        await client.query("UPDATE orders SET date_canceled = CURRENT_TIMESTAMP WHERE order_id = $1", [order_id]);
        order.rows.map(obj => client.query("UPDATE items SET number_in_stock = number_in_stock + $1 WHERE item_id = $2", [obj.quantity, obj.item_id]));
        await client.query('COMMIT');
        success = true;
      } catch (e) {
        await client.query('ROLLBACK');
        success = false;
      } finally {
        client.release();
        return success;
      }
    };
//for testing
    static async deleteAllOrders() {
      await pool.query("DELETE FROM orders WHERE order_id > 0");
      return;
    };
  };
