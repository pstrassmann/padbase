const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan');
const dotenv = require('dotenv')

// Load config
dotenv.config({ path: './config/config.env' });

const app = express();
connectDB();

// Allow express to parse json
app.use(express.json({ extended: false }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/dogs', require('./routes/dogs'));
app.use('/api/people', require('./routes/persons'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));

