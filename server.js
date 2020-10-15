const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const dotenv = require('dotenv');
const session = require('express-session');
const connectFlash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);

// Load config
dotenv.config({ path: './config/config.env' });


require('./config/passport')(passport);

const app = express();
connectDB();

// Allow express to parse json
app.use(express.json({ extended: false }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const sess = {
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {maxAge: 3600000 * 24}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

// Sessions
app.use(session(sess));
app.use(connectFlash());

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth'));
app.use('/api/dogs', require('./routes/dogs'));
app.use('/api/people', require('./routes/persons'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  app.get('/*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build',
    'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in *${process.env.NODE_ENV}* mode on port ${PORT}! `));

