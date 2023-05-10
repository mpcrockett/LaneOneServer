const express = require('express');
const cors = require('cors');
const pg = require('pg');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json')
const userRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const productRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const session = require('express-session');
const pool = require('./db');
const categoryRouter = require('./routes/category');
const pgSession = require('connect-pg-simple')(session);

const pgPool = new pg.Pool({
    // Insert pool options here
});

module.exports = function(app) {
  app.use(cors());
  app.use(express.json());
  app.use(session({
    secret: process.env.SESSION_SECRET,
    proxy: true,
    resave: false,
    saveUninitialized: true,
    store: new pgSession({
      pool: pool,
      tableName: 'session'
    }),
    cookie: {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : false,
    }
  }));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api/login', loginRouter);
  app.use('/api/users', userRouter);
  app.use('/api/products', productRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/category', categoryRouter);
};