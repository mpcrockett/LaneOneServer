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
    console.log('Hit')
    try {
      const getUser = await User.checkGoogleRegistration(issuer, profile.id);
      if(!getUser) {
        const newUser = new User({ first_name: profile.name.givenName, last_name: profile.name.familyName, email: profile.emails[0].value, provider: issuer, google_id: profile.id});
        await newUser.registerGoogleUser();
        return cb(null, newUser);
      } 
      return cb(null, getUser)
    } catch (error) {
      console.log('hit error')
      return cb(error)
    }
  }
));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { user_id: user.user_id, username: user.username, first_name: user.first_name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

module.exports = passport;