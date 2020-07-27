const express = require('express');
const Person = require('../models/Person');

const router = express.Router();

// @desc      Get all people
// @route     GET api/persons
router.get('/', async (req, res) => {
  try {
    const people = await Person.find().sort({
      name: -1,
    });
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc      Add new person
// @route     POST api/persons
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
