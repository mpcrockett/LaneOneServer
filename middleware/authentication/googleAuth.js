const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const User = require('../../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/api/google-auth/oauth2/redirect',
  scope: ['profile', 'email']
  },
  async function verify(issuer, profile, cb) {
    try {
      const getUser = await User.checkGoogleRegistration(issuer, profile.id);
      if(!getUser) {
        const newUser = new User({
          first_name: profile.name.givenName, 
          last_name: profile.name.familyName, 
          email: profile.emails[0].value, 
          provider: issuer, google_id: profile.id
        });
        await newUser.registerGoogleUser();
        return cb(null, newUser);
      } 
      return cb(null, getUser)
    } catch (error) {
      return cb(error)
    }
  }
));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, user);
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    console.log("Hit deserialization.")
    return cb(null, user);
  });
});

module.exports = passport;