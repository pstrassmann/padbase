const currentFostersData = require('./currentFostersData');
const Dog = require('../models/Dog');
const Person = require('../models/Person');
const connectDB = require('../config/db');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });
connectDB();

// const capitalizeWords = (str) => {
//   const splitStr = str.toLowerCase().trim().split(' ');
//   const capitalizedStrArray = splitStr.map( (word) => word[0].toUpperCase() + word.slice(1) )
//   return capitalizedStrArray.join(' ');
// }

const capitalizeWords = (s) => {
  const re = /(\b[a-z](?!\s))/g;
  const capitalized = s.replace(re, x => x.toUpperCase() );
  return capitalized;
}

currentFostersData.forEach( async (entry) => {
  let name;
  let tags = [];
  const address = entry['Address'];
  const status = entry['Status'].toLowerCase();
  const onWebsite = entry['On website'];
  const fosterCoordEmail = entry['Foster Coordinator Email'].toLowerCase();
  const fosterEmail = entry['Email'].toLowerCase();

  const rawName = entry['Name'].toLowerCase();
  const splitName = rawName.split(' ');

  // Check if pup
  if (splitName.includes('pup:')) {
    name = capitalizeWords(splitName.slice(splitName.indexOf('pup:')+1).join(' '));
    tags.push('Pup');

    // Check if mama
  } else if (splitName.includes('(mama)')) {
    name = capitalizeWords(splitName.slice(0, splitName.indexOf('(mama)')).join(' '));
    tags.push('Mama');
  } else {
    name = capitalizeWords(rawName);
  }

  const foster =  await Person.findOne({$or: [{email: fosterEmail}, { altEmails: {$in: [fosterEmail]} }]});
  const fosterCoord = await Person.findOne({email: fosterCoordEmail});

  if (!foster) {
    console.log(`Foster not found: ${entry['Foster Name']} with email ${entry['Email']}`);
  }
  if (!fosterCoord) {
    console.log(`Foster Coord not found: ${entry['Foster Coordinator']} with email ${entry['Foster Coordinator Email']}`);
  }

  let newDog = new Dog({
    name,
    currentFoster: foster.id,
    fosterCoordinator: fosterCoord.id,
  });

  if (status) {
    newDog.status = [status];
  }

  try {
    await newDog.save();
  } catch (e) {
    console.error(e);
  }


});

