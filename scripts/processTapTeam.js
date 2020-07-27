const tapTeam = require('./tapTeam');
const Dog = require('../models/Dog');
const Person = require('../models/Person');
const connectDB = require('../config/db');
const dotenv = require('dotenv');

// Load config
dotenv.config({ path: './config/config.env' });
connectDB();

tapTeam.forEach( async (entry) => {
  const name = entry['name'];
  const email = entry['email'].toLowerCase();
  const role = entry['role'].split(' / ');
  const team = [entry['team']];
  const phone = entry['phone'];
  const address = entry['address'];
  const splitName = name.split(' ');
  const firstName = splitName[0];
  const lastName = splitName.slice(1).join(' ');
  const onStaff = true;

  const existingUser = await Person.findOne({"email": email});
    if (!existingUser) {
      const newPerson = new Person({
        firstName,
        lastName,
        email,
        onStaff,
        team,
        role,
      });
      if (phone) newPerson.phone = phone;
      if (address) newPerson.address = address;
      // newPerson.save();
    } else {
      let modified = false;
        role.forEach((r) => {
          if (!existingUser.role.includes(r)) {
            existingUser.role.push(r);
            modified = true;
          }
        })

      team.forEach((t) => {
        if (!existingUser.team.includes(t)) {
          existingUser.team.push(t);
          modified = true;
        }
      })
      if (modified) {
        // existingUser.save();
      }
    }
});