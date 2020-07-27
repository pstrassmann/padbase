const currentFostersData = require('./currentFostersData');
const Dog = require('../models/Dog');
const Person = require('../models/Person');
const connectDB = require('../config/db');
const dotenv = require('dotenv');

// Load config
dotenv.config({ path: './config/config.env' });
connectDB();

const capitalizeWords = (s) => {
  const re = /(\b[a-z](?!\s))/g;
  const capitalized = s.replace(re, x => x.toUpperCase() );
  return capitalized;
}

const formatPhoneNumber = (phoneNumberString) => {
  let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + '-' + match[2] + '-' + match[3];
  }
  return null;
};

currentFostersData.forEach(async (entry) => {
  // const fosterCoordEmail = entry['Foster Coordinator Email'];
  // const vetCoordEmail = entry['Vetting Coordinator Email'];
  // const adoptCoordEmail = entry['Adoptions Coordinator Email'];
  let fosterEmail = entry['Email'];

  if (typeof fosterEmail === 'string' && fosterEmail.includes('@')) {
    fosterEmail = fosterEmail.toLowerCase();
    const existingUser = await Person.findOne({ email: fosterEmail });
    if (!existingUser) {
      const name = entry['Foster Name'];
      const email = fosterEmail;
      const phone = String(entry['Phone']);
      const address = entry['Address'];
      const homeCheck = entry['Homecheck'];
      const splitName = name.split(' ');
      const firstName = splitName[0];
      const lastName = splitName.slice(1).join(' ');
      const potentialDup = await Person.findOne({ firstName, lastName });
      const newPerson = new Person({
        firstName,
        lastName,
        email,
        role: ['Foster'],
      });
      if (phone && !phone.includes('N/A')) {
        const formattedPhone = formatPhoneNumber(phone);
        newPerson.phone = formattedPhone;
        if (potentialDup && !potentialDup.phone) {
          potentialDup.phone = formattedPhone;
        }
      }
      if (address && !address.includes('N/A')) {
        newPerson.address = capitalizeWords(address);
      }
      if (potentialDup && !potentialDup.address) {
        potentialDup.address = capitalizeWords(address);
      }
      if (homeCheck) {
        if (homeCheck === "TRUE") {
          newPerson.homeCheck = "complete";
        } else if (homeCheck === "FALSE") {
          newPerson.homeCheck = "incomplete";
        }
      }

      if (homeCheck && potentialDup && !potentialDup.homeCheck) {
        if (homeCheck === "TRUE") {
          potentialDup.homeCheck = "complete";
        } else if (homeCheck === "FALSE") {
          potentialDup.homeCheck = "incomplete";
        }      }

      if (!potentialDup) {
        try {
          await newPerson.save();
        } catch (e) {
          console.error(e);
        }
      } else {
        if (!potentialDup.role.includes('Foster')) {
          potentialDup.role.push('Foster');
        }
          if (potentialDup.altEmails === undefined) {
            // console.log(1)
            potentialDup.altEmails = [email];
          } else {
            // console.log(2)
            potentialDup.altEmails.push(email);
          }
        try {
          // console.log(potentialDup);
          await potentialDup.save();
        } catch (e) {
          console.error(e);
        }
      }
    } else {
    }

  }
});
