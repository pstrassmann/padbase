const express = require('express');
const Dog = require('../models/Dog');
const Person = require('../models/Person');
const checkValidEmailFormat = require('../utils/checkValidEmailFormat');
const moment = require('moment');

const router = express.Router();

// @desc      Get all dogs
// @route     GET api/dogs
router.get('/', async (req, res) => {
  try {
    const dogs = await Dog.find()
      .populate({ path: 'parents', select: '_id name' })
      .populate({ path: 'fosterCoordinator', select: '_id firstName lastName' })
      .populate({ path: 'adoptionCoordinator', select: '_id firstName lastName' })
      .populate({ path: 'vettingCoordinator', select: '_id firstName lastName' })
      .populate({ path: 'currentFoster', select: '_id firstName lastName phone email address' })
      .sort({
        intakeDate: -1,
        name: 1,
      });
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/', async (req, res) => {
  try {
    const {
      dogID,
      name,
      sex,
      weight,
      isFixed,
      birthday,
      intakeDate,
      primaryStatus,
      vettingStatus,
      fosterCoordinator,
      vettingCoordinator,
      adoptionCoordinator,
      fosterInfo,
      initialDateWCurrentFoster,
      breed,
      mother,
      primaryVet,
      origin,
      groupName,
      fee,
      vettingDates,
      tvtStatus,
      fourDXStatus,
      history,
      otherVetsUsed,
      fleaMedBrand,
      medNotes,
      upcomingVetAppts,
      notes,
    } = req.body;

    // Validate only required field for dog (name)
    if (name === '') {
      return res.json({ error: "Dog name is required" });
    }

    let currentFoster;
    if (fosterInfo && !fosterInfo.newFoster && fosterInfo._id) {
      currentFoster = fosterInfo._id;
    }

    if (fosterInfo && fosterInfo.newFoster === true) {
      if (!fosterInfo.email.trim() || !fosterInfo.fullName.trim()) {
        return res.json({ error: 'Name and email required for adding new foster' });
      }
      const newFosterEmail = fosterInfo.email.trim().toLowerCase();
      if (!checkValidEmailFormat(newFosterEmail)) {
        return res.json({ error: "New foster's email is invalid" });
      }
      const existingUserWithEmail = await Person.exists({ email: newFosterEmail });
      if (existingUserWithEmail) {
        return res.json({ error: "New foster's email already exists in database" });
      }
      const nameArray = fosterInfo.fullName.trim().split(' ');
      let firstName;
      let lastName;
      firstName = nameArray[0];
      if (nameArray.length > 1) {
        lastName = nameArray.slice(1).join(' ');
      }
      const newFoster = new Person({
        firstName,
        lastName,
        phone: fosterInfo.phone || undefined,
        email: newFosterEmail,
        address: fosterInfo.address || undefined,
      });

      const newlyAddedFoster = await newFoster.save();
      currentFoster = newlyAddedFoster._id;
    }
    const existingDog = await Dog.findById(dogID);
    if (!existingDog) res.status(500).json({ error: 'Error saving dog' });
    existingDog.name = name;
    existingDog.sex = sex === 'M' || sex === 'F' ? sex : undefined;
    existingDog.weight = weight === null ? undefined : parseInt(weight);
    existingDog.isFixed = isFixed === 'Yes' ? true : isFixed === 'No' ? false : null;
    existingDog.birthday = moment(birthday, 'MM-DD-YY').isValid() ? moment(birthday, 'MM-DD-YY').toDate() : undefined;
    existingDog.intakeDate = moment(intakeDate, 'MM-DD-YY').isValid()
      ? moment(intakeDate, 'MM-DD-YY').toDate()
      : undefined;
    existingDog.status = primaryStatus === null ? undefined : primaryStatus.toLowerCase();
    existingDog.vettingStatus = vettingStatus === null ? undefined : vettingStatus.toLowerCase();
    existingDog.fosterCoordinator = fosterCoordinator._id === null ? undefined : fosterCoordinator._id;
    existingDog.vettingCoordinator = vettingCoordinator._id === null ? undefined : vettingCoordinator._id;
    existingDog.adoptionCoordinator = adoptionCoordinator._id === null ? undefined : adoptionCoordinator._id;
    existingDog.currentFoster = currentFoster;
    existingDog.initialDateWCurrentFoster = moment(initialDateWCurrentFoster, 'MM-DD-YY').isValid()
      ? moment(initialDateWCurrentFoster, 'MM-DD-YY').toDate()
      : undefined;
    existingDog.breed = breed === null ? undefined : breed.toLowerCase().split(',');

    // parents[0] is always the mother
    if (mother._id !== null && existingDog.parents[0] !== mother._id) {
      existingDog.parents = [mother._id, ...existingDog.parents.slice(1)];
    } else if ( mother._id === null ) {
      existingDog.parents = [];
    }

    existingDog.medical.primaryVet = primaryVet === null ? undefined : primaryVet.toLowerCase();
    existingDog.medical.allVetsUsed = [
      ...new Set([primaryVet && primaryVet.toLowerCase(), ...(otherVetsUsed === null ? '' : otherVetsUsed).toLowerCase().split(',')]),
    ].filter((entry) => {
      return entry !== null && entry !== '';
    });

    existingDog.medical.tvt = tvtStatus === 'positive' ? true : tvtStatus === 'negative' ? false : null;
    existingDog.medical.fourDX = fourDXStatus === 'positive' ? true : fourDXStatus === 'negative' ? false : null;
    existingDog.medical.fleaMedBrand = fleaMedBrand === null ? undefined : fleaMedBrand.toLowerCase();
    existingDog.medical.upcomingVetAppts = upcomingVetAppts === null ? undefined : upcomingVetAppts;
    existingDog.medical.medNotes = medNotes === null ? undefined : medNotes;
    existingDog.origin = origin === null ? undefined : origin.toLowerCase();
    existingDog.group = groupName === null ? undefined : groupName.toLowerCase();
    existingDog.fee = fee === null ? undefined : parseInt(fee);
    existingDog.vettingDates = Object.fromEntries(
      Object.entries(vettingDates).map(([key, value]) => [key, moment(value, 'MM-DD-YY').isValid() ? moment(value, 'MM-DD-YY').toDate() : null])
    );
    existingDog.history = history === null ? undefined : history;
    existingDog.notes = notes === null ? undefined : notes;

    await existingDog.save();

    return res.json(existingDog);
  } catch (err) {
    res.status(500).json({ error: err });
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
