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
const passport = require('passport');
const User = require('./models/User');
const GoogleStrategy = require('passport-google-oidc');
const pool = require('./db');
const categoryRouter = require('./routes/category');
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);
const pgSession = require('connect-pg-simple')(session);
const { calculateOrderAmount } = require('./utils');
const authenticate = require('./middleware/authentication/authenticate');
const Order = require('./models/Order');
const Address = require('./models/Address');

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
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8000/api/google-auth/oauth2/redirect',
    scope: ['profile', 'email', 'openid']
    },
    async (issuer, profile, done) => {
      try {
        let user = await User.checkGoogleRegistration(issuer, profile.id);
        if(!user) {
          user = new User({
            first_name: profile.name.givenName, 
            last_name: profile.name.familyName, 
            email: profile.emails[0].value, 
            provider: issuer,
            google_id: profile.id
          });
          await user.registerGoogleUser();
        } 
        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  ));
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user)
  });
  app.post('/api/google-auth', passport.authenticate('google'));
  app.get('/api/google-auth/oauth2/redirect', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/account'}),
    (req, res) => {
      res.redirect('http://localhost:5173/callback')
    }
  );
  app.post('/api/create-checkout-session', authenticate, async (req, res) => {
    let orderId;
    try {
      const address = new Address(req.body.address);
      const addressId = await address.createNewAddress();
      const order = new Order({
        items: req.body.items,
        user_id: req.user.user_id,
        address_id: addressId,
      });
      orderId = await order.createNewOrder();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: req.body.items.map(((item) => {
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
              },
              unit_amount: item.price * 100
            },
            quantity: item.quantity,
          }
        })),
        success_url: 'http://localhost:5173/success',
        cancel_url: 'http://localhost:5173/cancel'
      })
      res.send({url: session.url});
    } catch (error) {
      await Order.cancelOrderById(orderId);
      res.status(500).send({ error: error.message });
    }
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api/login', loginRouter);
  app.use('/api/users', userRouter);
  app.use('/api/products', productRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/category', categoryRouter); 
};