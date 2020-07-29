const Dog = require('../models/Dog');
const Person = require('../models/Person');
const connectDB = require('../config/db');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
connectDB();

const log = async () => {
const dog = await Dog.findOne({name: "Espresso"});
console.log(dog);
}

log();
