const express = require('express');
const Dog = require('../models/Dog');
const Person = require('../models/Person');
const checkValidEmailFormat = require('../utils/checkValidEmailFormat');
const moment = require('moment');
const ensureAuth = require('../middleware/ensureAuth');

const router = express.Router();

// @desc      Get all dogs
// @route     GET api/dogs
// @access    Private

router.get('/', ensureAuth, async (req, res) => {
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
    status,
    vettingStatus,
    fosterCoordinator,
    vettingCoordinator,
    adoptionCoordinator,
    currentFoster,
    initialDateWCurrentFoster,
    breed,
    parents,
    origin,
    group,
    fee,
    vettingDates,
    medical,
    history,
    notes,
  }
) => {
  dog.name = name;
  dog.sex = sex === 'M' || sex === 'F' ? sex : undefined;
  dog.weight = weight || undefined;
  dog.isFixed = isFixed === true || isFixed === false ? isFixed : null;
  dog.birthday = moment(birthday).isValid() ? birthday : undefined;
  dog.intakeDate = moment(intakeDate).isValid() ? intakeDate : undefined;
  dog.status = status ? status.toLowerCase() : undefined;
  dog.vettingStatus = vettingStatus ? vettingStatus.toLowerCase() : undefined;
  dog.fosterCoordinator = fosterCoordinator._id === null ? undefined : fosterCoordinator._id;
  dog.vettingCoordinator = vettingCoordinator._id === null ? undefined : vettingCoordinator._id;
  dog.adoptionCoordinator = adoptionCoordinator._id === null ? undefined : adoptionCoordinator._id;
  dog.currentFoster = currentFoster;
  dog.initialDateWCurrentFoster = moment(initialDateWCurrentFoster).isValid() ? initialDateWCurrentFoster : undefined;
  dog.breed = breed || [];

  dog.parents = parents ? parents : [];
  // parents[0] is always the mother
  // if (mother._id !== null && dog.parents[0] !== mother._id) {
  //   dog.parents = [mother._id, ...dog.parents.slice(1)];
  // } else if (mother._id === null) {
  // }

  dog.medical.primaryVet = medical.primaryVet ? medical.primaryVet.toLowerCase() : undefined;
  dog.medical.allVetsUsed = medical.allVetsUsed;
  dog.medical.tvt = medical.tvt === true || medical.tvt === false ? medical.tvt : null;
  dog.medical.fourDX = medical.fourDX === true || medical.fourDX === false ? medical.fourDX : null;
  dog.medical.fleaMedBrand = medical.fleaMedBrand ? medical.fleaMedBrand.toLowerCase() : undefined;
  dog.medical.upcomingVetAppts = medical.upcomingVetAppts;
  dog.medical.medNotes = medical.medNotes;
  dog.origin = origin ? origin.toLowerCase() : undefined;
  dog.group = group ? group.toLowerCase() : undefined;
  dog.fee = fee ? parseInt(fee) : undefined;
  dog.vettingDates = Object.fromEntries(
    Object.entries(vettingDates).map(([key, value]) => [key, moment(value).isValid() ? value : null])
  );
  dog.history = history;
  dog.notes = notes;
  return dog;
};
// @desc      Update dog
// @route     PUT api/dogs
// @access    Private
router.put('/', ensureAuth, async (req, res) => {
  try {
    const {
      _id,
      name,
      sex,
      weight,
      isFixed,
      birthday,
      intakeDate,
      status,
      vettingStatus,
      fosterCoordinator,
      vettingCoordinator,
      adoptionCoordinator,
      currentFoster,
      initialDateWCurrentFoster,
      breed,
      parents,
      origin,
      group,
      fee,
      vettingDates,
      medical,
      history,
      notes,
    } = req.body;

    const dogFields = {
      _id,
      name,
      sex,
      weight,
      isFixed,
      birthday,
      intakeDate,
      status,
      vettingStatus,
      fosterCoordinator,
      vettingCoordinator,
      adoptionCoordinator,
      initialDateWCurrentFoster,
      breed,
      parents,
      origin,
      group,
      fee,
      vettingDates,
      medical,
      history,
      notes,
    };

    // Validate only required field for dog (name)
    if (name === '') {
      return res.json({ error: 'Dog name is required' });
    }

    if (currentFoster && !currentFoster.newFoster && currentFoster._id) {
      dogFields.currentFoster = currentFoster._id;
    }

    if (currentFoster.newFoster === true) {
      if (!currentFoster.email.trim() || !currentFoster.fullName.trim()) {
        return res.json({ error: 'Name and email required for adding new foster' });
      }
      const newFosterEmail = currentFoster.email.trim().toLowerCase();
      if (!checkValidEmailFormat(newFosterEmail)) {
        return res.json({ error: "New foster's email is invalid" });
      }
      const existingUserWithEmail = await Person.exists({ email: newFosterEmail });
      if (existingUserWithEmail) {
        return res.json({ error: "New foster's email already exists in database" });
      }
      const nameArray = currentFoster.fullName.trim().split(' ');
      let firstName;
      let lastName;
      firstName = nameArray[0];
      if (nameArray.length > 1) {
        lastName = nameArray.slice(1).join(' ');
      }
      const newFoster = new Person({
        firstName,
        lastName,
        phone: currentFoster.phone || undefined,
        email: newFosterEmail,
        address: currentFoster.address || undefined,
      });

      const newlyAddedFoster = await newFoster.save();
      dogFields.currentFoster = newlyAddedFoster;
    }

    const existingDog = await Dog.findById(_id);

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
// @access    Private
router.post('/', ensureAuth, async (req, res) => {
  try {
    const {
      name,
      sex,
      weight,
      isFixed,
      birthday,
      intakeDate,
      status,
      vettingStatus,
      fosterCoordinator,
      vettingCoordinator,
      adoptionCoordinator,
      currentFoster,
      initialDateWCurrentFoster,
      breed,
      parents,
      origin,
      group,
      fee,
      vettingDates,
      medical,
      history,
      notes,
    } = req.body;

    const dogFields = {
      name,
      sex,
      weight,
      isFixed,
      birthday,
      intakeDate,
      status,
      vettingStatus,
      fosterCoordinator,
      vettingCoordinator,
      adoptionCoordinator,
      initialDateWCurrentFoster,
      breed,
      parents,
      origin,
      group,
      fee,
      vettingDates,
      medical,
      history,
      notes,
    };

    // Validate only required field for dog (name)
    if (name === '') {
      return res.json({ error: 'Dog name is required' });
    }

    if (currentFoster && !currentFoster.newFoster && currentFoster._id) {
      dogFields.currentFoster = currentFoster._id;
    }

    if (currentFoster && currentFoster.newFoster === true) {
      if (!currentFoster.email.trim() || !currentFoster.fullName.trim()) {
        return res.json({ error: 'Name and email required for adding new foster' });
      }
      const newFosterEmail = currentFoster.email.trim().toLowerCase();
      if (!checkValidEmailFormat(newFosterEmail)) {
        return res.json({ error: "New foster's email is invalid" });
      }
      const existingUserWithEmail = await Person.exists({ email: newFosterEmail });
      if (existingUserWithEmail) {
        return res.json({ error: "New foster's email already exists in database" });
      }
      const nameArray = currentFoster.fullName.trim().split(' ');
      let firstName;
      let lastName;
      firstName = nameArray[0];
      if (nameArray.length > 1) {
        lastName = nameArray.slice(1).join(' ');
      }
      const newFoster = new Person({
        firstName,
        lastName,
        phone: currentFoster.phone || undefined,
        email: newFosterEmail,
        address: currentFoster.address || undefined,
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
// @access    Private
router.post('/group', ensureAuth, async (req, res) => {
  try {
    const { newDogsArray } = req.body;
    const anyMissingName = newDogsArray.map((dog) => Boolean(dog.name)).includes(false);
    if (anyMissingName) return res.json({ error: 'All dogs must have a name' });

    const newDogsArray_validated = newDogsArray.map((dog) => {
      return {
        name: dog.name,
        sex: dog.sex === 'M' || dog.sex === 'F' ? dog.sex : undefined,
        weight: dog.weight ? parseInt(dog.weight) : undefined,
        birthday:
          dog.birthday && moment(dog.birthday).isValid()
            ? dog.birthday
            : undefined,
        intakeDate: moment(dog.intakeDate).isValid()
          ? dog.intakeDate
          : undefined,
        origin: dog.origin ? dog.origin.toLowerCase() : undefined,
        group: dog.group ? dog.group.toLowerCase() : undefined,
        status: dog.status ? dog.status.toLowerCase() : undefined,
        vettingStatus: dog.vettingStatus ? dog.vettingStatus.toLowerCase() : undefined,
        parents: dog.parents ? dog.parents : [],
      };
    });
    const insertedDogs = await Dog.insertMany(newDogsArray_validated);
    return res.json(insertedDogs);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// @desc      Delete dog
// @route     DELETE api/dogs/
// @access    Private
router.delete('/', ensureAuth, async (req, res) => {
  try {
    const { _id } = req.body;
    await Dog.findByIdAndDelete(_id);
    return res.json({ success: 'true' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
module.exports = router;
