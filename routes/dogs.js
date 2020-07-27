const express = require('express');
const Dog = require('../models/Dog');
const Person = require('../models/Person');

const router = express.Router();

// @desc      Get all dogs
// @route     GET api/dogs
router.get('/', async (req, res) => {
  try {
    const dogs = await Dog.find().sort({
      name: -1,
    });
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc      Add new dog
// @route     POST api/dogs
router.post('/', async (req, res) => {
  try {
    const newDog = new Dog({
      ...req.body,
    });
    const dog = await newDog.save();
    res.json(dog);
  } catch (err) {
    res.status(500).json({ error: 'Error creating new dog entry' });
  }
});

module.exports = router;
