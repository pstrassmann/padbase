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

const fillDogFields = (dog, {
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
  currentFoster,
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
  notes}) => {

  dog.name = name;
  dog.sex = sex === 'M' || sex === 'F' ? sex : undefined;
  dog.weight = weight === null ? undefined : parseInt(weight);
  dog.isFixed = isFixed === 'Yes' ? true : isFixed === 'No' ? false : null;
  dog.birthday = moment(birthday, 'MM-DD-YY').isValid() ? moment(birthday, 'MM-DD-YY').toDate() : undefined;
  dog.intakeDate = moment(intakeDate, 'MM-DD-YY').isValid()
    ? moment(intakeDate, 'MM-DD-YY').toDate()
    : undefined;
  dog.status = primaryStatus === null ? undefined : primaryStatus.toLowerCase();
  dog.vettingStatus = vettingStatus === null ? undefined : vettingStatus.toLowerCase();
  dog.fosterCoordinator = fosterCoordinator._id === null ? undefined : fosterCoordinator._id;
  dog.vettingCoordinator = vettingCoordinator._id === null ? undefined : vettingCoordinator._id;
  dog.adoptionCoordinator = adoptionCoordinator._id === null ? undefined : adoptionCoordinator._id;
  dog.currentFoster = currentFoster;
  dog.initialDateWCurrentFoster = moment(initialDateWCurrentFoster, 'MM-DD-YY').isValid()
    ? moment(initialDateWCurrentFoster, 'MM-DD-YY').toDate()
    : undefined;
  dog.breed = breed === null ? undefined : breed.toLowerCase().split(',');

  // parents[0] is always the mother
  if (mother._id !== null && dog.parents[0] !== mother._id) {
    dog.parents = [mother._id, ...dog.parents.slice(1)];
  } else if ( mother._id === null ) {
    dog.parents = [];
  }

  dog.medical.primaryVet = primaryVet === null ? undefined : primaryVet.toLowerCase();
  dog.medical.allVetsUsed = [
    ...new Set([primaryVet && primaryVet.toLowerCase(), ...(otherVetsUsed === null ? '' : otherVetsUsed).toLowerCase().split(',')]),
  ].filter((entry) => {
    return entry !== null && entry !== '';
  });

  dog.medical.tvt = tvtStatus === 'positive' ? true : tvtStatus === 'negative' ? false : null;
  dog.medical.fourDX = fourDXStatus === 'positive' ? true : fourDXStatus === 'negative' ? false : null;
  dog.medical.fleaMedBrand = fleaMedBrand === null ? undefined : fleaMedBrand.toLowerCase();
  dog.medical.upcomingVetAppts = upcomingVetAppts === null ? undefined : upcomingVetAppts;
  dog.medical.medNotes = medNotes === null ? undefined : medNotes;
  dog.origin = origin === null ? undefined : origin.toLowerCase();
  dog.group = groupName === null ? undefined : groupName.toLowerCase();
  dog.fee = fee === null ? undefined : parseInt(fee);
  dog.vettingDates = Object.fromEntries(
    Object.entries(vettingDates).map(([key, value]) => [key, moment(value, 'MM-DD-YY').isValid() ? moment(value, 'MM-DD-YY').toDate() : null])
  );
  dog.history = history === null ? undefined : history;
  dog.notes = notes === null ? undefined : notes;
  return dog;
}

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

    const dogFields = {
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
      notes
    }

    // Validate only required field for dog (name)
    if (name === '') {
      return res.json({ error: "Dog name is required" });
    }

    let currentFoster;
    if (fosterInfo && !fosterInfo.newFoster && fosterInfo._id) {
      dogFields.currentFoster = fosterInfo;
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
      dogFields.currentFoster = newlyAddedFoster;
    }
    const existingDog = await Dog.findById(dogID);

    if (!existingDog) res.status(500).json({ error: 'Error saving dog' });

    const dog = fillDogFields(existingDog, dogFields);
    await dog.save();
    const populatedDog = await Dog.findById(dog._id)
      .populate({ path: 'parents', select: '_id name' })
      .populate({ path: 'fosterCoordinator', select: '_id firstName lastName' })
      .populate({ path: 'adoptionCoordinator', select: '_id firstName lastName' })
      .populate({ path: 'vettingCoordinator', select: '_id firstName lastName' })
      .populate({ path: 'currentFoster', select: '_id firstName lastName phone email address' });
    return res.json(populatedDog);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// @desc      Add new dog
// @route     POST api/dogs
router.post('/', async (req, res) => {
  try {
    const {
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

    const dogFields = {
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
      notes
    }

    // Validate only required field for dog (name)
    if (name === '') {
      return res.json({ error: "Dog name is required" });
    }

    let currentFoster;
    if (fosterInfo && !fosterInfo.newFoster && fosterInfo._id) {
      dogFields.currentFoster = fosterInfo._id;
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
      dogFields.currentFoster = newlyAddedFoster;
    }

    const newDog = new Dog;
    const dog = fillDogFields(newDog, dogFields);
    await dog.save();
    const populatedDog = await Dog.findById(dog._id)
      .populate({ path: 'parents', select: '_id name' })
      .populate({ path: 'fosterCoordinator', select: '_id firstName lastName' })
      .populate({ path: 'adoptionCoordinator', select: '_id firstName lastName' })
      .populate({ path: 'vettingCoordinator', select: '_id firstName lastName' })
      .populate({ path: 'currentFoster', select: '_id firstName lastName phone email address' });
    return res.json(populatedDog);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
