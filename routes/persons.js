const express = require('express');
const Person = require('../models/Person');

// Escapes special characters from search
const escapeRegExp = (string) => {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

const router = express.Router();

// @desc      Get all people
// @route     GET api/people
router.get('/', async (req, res) => {
  try {
    const people = await Person.find()
      .select('_id firstName lastName')
      .sort({
      firstName: 1,
      lastName: 1,
    });
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc      Get person name, phone, email, address
// @route     GET api/people
router.get('/contact', async (req, res) => {
  const { _id } = req.headers;
  try {
    const person = await Person.findOne({ _id })
      .select('_id firstName lastName phone email address')
      .sort({
        firstName: 1,
        lastName: 1,
      });
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
// @desc      Check if email is unique
// @route     GET api/people/email
router.get('/email', async (req, res) => {
  const { email } = req.headers;
  const emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  const re = new RegExp(emailPattern,'g');
  const emailRegExpMatchArray = email.match(re);
  if (!emailRegExpMatchArray || (emailRegExpMatchArray[0] !== email)) {
    res.json('invalid email');
  }
  try {
    const person = await Person.findOne({ email: email.toLowerCase() })
    if (person) {
      res.json(false);
    } else {
      res.json(true);
    }

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc      Get Foster, Vetting, and Adoptions Coordinators
// @route     GET api/people/fva-coordinators
router.get('/fva-coordinators', async (req, res) => {
  try {
    const coordinators = await Person.find({
      role: { $in: ['Foster Coordinator', 'Vetting Coordinator', 'Adoptions Coordinator'] },
    })
      .select('_id firstName lastName role')
      .sort({
        firstName: 1,
        lastName: 1,
      });
    res.json(coordinators);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc      Get
// @route     GET api/people/search/
router.get('/search', async (req, res) => {
  const { role, search_str } = req.headers;
  try {
    const peopleWithRole = await Person.find({ role: role }).select('_id firstName lastName');
    const regex = new RegExp('\\b(' + escapeRegExp(search_str) + ')', 'gi');
    const peopleMatches = peopleWithRole.filter((person) => {
      const fullName = `${person.firstName ? person.firstName : ''} ${person.lastName ? person.lastName : ''}`;
      return fullName.match(regex) !== null && fullName.match(regex).length > 0;
    });
    res.json(peopleMatches);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc      Add new person
// @route     POST api/people
router.post('/', async (req, res) => {
  try {
    const newPerson = new Person({
      ...req.body,
    });
    const person = await newPerson.save();
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: 'Error creating new person' });
  }
});

module.exports = router;
