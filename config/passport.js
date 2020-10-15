const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Person = require('../models/Person');

const authenticateUser = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        try {
          let user = await Person.findOne({ email, onStaff: true }); // check for email in altEmails as well?
          if (user) {
            done(null, user);
          } else {
            done(null, false, {message: `${email}`});
          }
        } catch (err) {
          console.error(err);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    console.log('USER ID: ', user.id);
    return done(null, user.id)
  });

  passport.deserializeUser((id, done) => {
    Person.findById(id, (err, user) => done(err, user));
  });
};

module.exports = authenticateUser;
