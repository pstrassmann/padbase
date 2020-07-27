const tapData = require('./tapData');
const Dog = require('../models/Dog');
const Person = require('../models/Person');
const connectDB = require('../config/db');
const dotenv = require('dotenv');

// Load config
dotenv.config({ path: './config/config.env' });
connectDB();

const formatPhoneNumber = (phoneNumberString) => {
  let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + '-' + match[2] + '-' + match[3];
  }
  return null;
};

tapData.forEach(async (entry) => {
  // const fosterCoordEmail = entry['Foster Coordinator Email'];
  // const vetCoordEmail = entry['Vetting Coordinator Email'];
  // const adoptCoordEmail = entry['Adoptions Coordinator Email'];
  let fosterEmail = entry['Fosters Email'];

  if (typeof fosterEmail === 'string' && fosterEmail.includes('@')) {
    fosterEmail = fosterEmail.toLowerCase();
    const existingUser = await Person.findOne({ email: fosterEmail });
    if (!existingUser) {
      const name = entry['Fosters Name'];
      const email = fosterEmail;
      const phone = String(entry['Fosters Phone']);
      const address = entry['Fosters Address'];
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
        newPerson.address = address;
      }
      if (potentialDup && !potentialDup.address) {
        potentialDup.address = address;
      }
      if (!potentialDup) {
        console.log(newPerson);
        try {
          // newPerson.save();
        } catch (e) {
          console.error(e);
        }
      } else {
        if (!potentialDup.role.includes('Foster')) {
          potentialDup.role.push('Foster');
        }
        console.log(potentialDup);
        try {
          // potentialDup.save();
        } catch (e) {
          console.error(e);
        }
      }
    } else {
    }

  }
});
