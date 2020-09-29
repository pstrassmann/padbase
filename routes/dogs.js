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

const fillDogFields = (
  dog,
  {
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
    notes,
  }
) => {
  dog.name = name;
  dog.sex = sex === 'M' || sex === 'F' ? sex : undefined;
  dog.weight = weight === null ? undefined : parseInt(weight);
  dog.isFixed = isFixed === 'Yes' ? true : isFixed === 'No' ? false : null;
  dog.birthday = moment(birthday, 'MM-DD-YY').isValid() ? moment(birthday, 'MM-DD-YY').toDate() : undefined;
  dog.intakeDate = moment(intakeDate, 'MM-DD-YY').isValid() ? moment(intakeDate, 'MM-DD-YY').toDate() : undefined;
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
  } else if (mother._id === null) {
    dog.parents = [];
  }

  dog.medical.primaryVet = primaryVet === null ? undefined : primaryVet.toLowerCase();
  dog.medical.allVetsUsed = [
    ...new Set([
      primaryVet && primaryVet.toLowerCase(),
      ...(otherVetsUsed === null ? '' : otherVetsUsed).toLowerCase().split(','),
    ]),
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
    Object.entries(vettingDates).map(([key, value]) => [
      key,
      moment(value, 'MM-DD-YY').isValid() ? moment(value, 'MM-DD-YY').toDate() : null,
    ])
  );
  dog.history = history === null ? undefined : history;
  dog.notes = notes === null ? undefined : notes;
  return dog;
};

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
      notes,
    };

    // Validate only required field for dog (name)
    if (name === '') {
      return res.json({ error: 'Dog name is required' });
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
      notes,
    };

    // Validate only required field for dog (name)
    if (name === '') {
      return res.json({ error: 'Dog name is required' });
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

    const newDog = new Dog();
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

// @desc      Add new dog group or litter
// @route     POST api/dogs/group
router.post('/group', async (req, res) => {
  try {
    const { newDogsArray } = req.body;
    const anyMissingName = newDogsArray.map((dog) => Boolean(dog.name)).includes(false);
    if (anyMissingName) return res.json({error: "All dogs must have a name"});

    const newDogsArray_validated = newDogsArray.map((dog) => {
      const parents = [];
      if (dog.mother && dog.mother._id ) {
        parents.push(dog.mother._id);
      }
      return {
        name: dog.name,
        sex: dog.sex === 'M' || dog.sex === 'F' ? dog.sex : undefined,
        weight: dog.weight ? parseInt(dog.weight) : undefined,
        isFixed: dog.isFixed === 'Yes' ? true : dog.isFixed === 'No' ? false : undefined,
        birthday:
          dog.birthday && moment(dog.birthday, 'MM-DD-YY').isValid()
            ? moment(dog.birthday, 'MM-DD-YY').toDate()
            : undefined,
        intakeDate:
          moment(dog.intakeDate, 'MM-DD-YY').isValid()
            ? moment(dog.intakeDate, 'MM-DD-YY').toDate()
            : undefined,
        origin: dog.origin ? dog.origin.toLowerCase() : undefined,
        group: dog['group'] ? dog['group'].toLowerCase() : undefined,
        status: dog.status ? dog.status.toLowerCase() : undefined,
        vettingStatus: dog.vettingStatus ? dog.vettingStatus.toLowerCase() : undefined,
        parents: parents.length > 0 ? parents : undefined,
      };
    });
    const insertedDogs =  await Dog.insertMany(newDogsArray_validated);
    return res.json(insertedDogs);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete('/', async (req, res) => {
  try {
  const {_id} = req.body;
  await Dog.findByIdAndDelete(_id);
  return res.json({ "success": "true" });
  } catch (err) {
    res.status(500).json({error: err});
  }
})
module.exports = router;
