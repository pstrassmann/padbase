const moment = require('moment');
const tapMaster = require('./tapMaster');
const Dog = require('../models/Dog');
const Person = require('../models/Person');
const connectDB = require('../config/db');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
connectDB();

const formatDate = (date, format = 'MM-DD-YYYY') => {
  const formattedDate = moment(date).format(format);
  if (formattedDate === 'Invalid date') {
    return null;
  }
  if (moment(formattedDate).isAfter('2008-01-01')) {
    return formattedDate;
  }
  return null;
};

const getNumFromStr = (str) => {
  const re = /[^0-9\.]+/g;
  return Number(str.replace(re, ''));
};

const capitalizeWords = (s) => {
  const re = /(\b[a-z](?!\s))/g;
  const capitalized = s.replace(re, x => x.toUpperCase() );
  return capitalized;
}

// Get dogs true name and identity from verbose name.
const getDogIdentityObj = (n) => {
  const dog = {};
  const rawName = n.toLowerCase();
  const splitName = rawName.split(' ');
  if (splitName.includes('pup:')) {
    dog.name = capitalizeWords(
      splitName.slice(splitName.indexOf('pup:') + 1).join(' ')
    );
    dog.mama = capitalizeWords(
      splitName.slice(0, splitName.indexOf('pup:')).join(' ')
    );
    dog.status = 'pup';
  } else if (splitName.includes('(mama)')) {
    dog.name = capitalizeWords(
      splitName.slice(0, splitName.indexOf('(mama)')).join(' ')
    );
    dog.status = 'mama';
  } else {
    dog.name = capitalizeWords(rawName);
  }
  return dog;
};

const applyLinkedCoordinator = async (
  coordinatorEmail_raw,
  coordPositionKey,
  currentDog
) => {

  if (!coordinatorEmail_raw.includes('@')) {
    return;
  }
  // Find and apply linked coordinator
  const coordinator = await Person.findOne({
    email: coordinatorEmail_raw.toLowerCase(),
  });

  // If no coordinator found with email
  if (!coordinator) {
    console.log(
      `${currentDog.name}: Unable to locate ${coordPositionKey} with email: ${coordinatorEmail_raw.toLowerCase()}`
    );

    // If coordinator with email was found but
    // mismatches dog's listed coordinator:
  } else if (
    currentDog[coordPositionKey] &&
    currentDog[coordPositionKey].toString() !== coordinator.id
  ) {
    console.log(`Mismatched ${coordPositionKey}`);

    // If coordinator with email was found
    // but dog has no current coordinator listed, then add
  } else if (!currentDog[coordPositionKey]) {
    currentDog[coordPositionKey] = coordinator.id;
  }
};

tapMaster.forEach(async (entry) => {
  try {
    const intakeDate_raw = entry['Dog Intake Date'];
    const name_raw = entry["Dog's Name"];
    const previousLocation_raw = entry['Previous Location'];
    const additionalHistory_raw = entry['Additional History'];
    const fosterName_raw = entry["Foster's Name"];
    const fosterCoordName_raw = entry['Foster Coordinator Name'];
    const fosterCoordEmail_raw = entry['Foster Coordinator Email'];
    const fosterPhone_raw = entry["Foster's Phone"];
    const fosterEmail_raw = entry["Foster's Email"];
    const fosterAddress_raw = entry["Foster's Address"];
    const birthday_raw = entry['Birthday'];
    const breed_raw = entry['Dog Breed'];
    const weight_raw = String(entry['Weight']);
    const sex_raw = String(entry['Sex']);
    const DHPP1Date_raw = entry['DHPP1 Date'];
    const DHPP2Date_raw = entry['DHPP2 Date'];
    const DHLPP3Date_raw = entry['DHLPP3 Date'];
    const bordetellaDate_raw = entry['Bordetella Date'];
    const rabiesDate_raw = entry['Rabies Date'];
    const microchipDate_raw = entry['Microchip Date'];
    const fixEntry_raw = entry['Spay/Neuter Date'].toLowerCase();
    const vettingCoordName_raw = entry['Vetting Coordinator'];
    const vettingCoordEmail_raw = entry['Vetting Coordinator Email'];
    const adoptionCoordName_raw = entry['Adoptions Coordinator'];
    const adoptionCoordEmail_raw = entry['Adoptions Coordinator Email'];
    const vettingStatus_raw = entry['Vetting Status'];
    const complete_raw = entry['Complete?'];

    const dogIdentityObj = getDogIdentityObj(name_raw);

    // Skip entry if missing dog name or intake date
    if (
      !name_raw ||
      name_raw.includes('N/A') ||
      !intakeDate_raw ||
      intakeDate_raw.includes('N/A')
    ) {
      return;
    }

    const name = dogIdentityObj.name;
    const existingDog = await Dog.findOne({ name })
      // .populate('fosterCoordinator')
      // .populate('vettingCoordinator')
      // .populate('adoptionCoordinator');

    // If dog doesn't exist, create new dog
    let currentDog;
    if (!existingDog) {
      currentDog = new Dog({
        name,
      });
    } else {
      currentDog = existingDog;
    }

    // If dog is a pup, search for and add mom if not already added
    if (dogIdentityObj.status && dogIdentityObj.status === 'pup') {
      const momName = dogIdentityObj.mama;
      const momDog = await Dog.findOne({ name: momName });
      if (!momDog) console.log(`Couldn't locate mom: ${ momName }`);
      if (momDog && (!currentDog.parents || !currentDog.parents.includes(momDog.id))) {
        currentDog.parents.push(momDog.id);
      }
    }

    // If dog is a mama, search for and add children if not already added
    if (dogIdentityObj.status && dogIdentityObj.status === 'mama') {
      const children = await Dog.find({ parents: {$in: [currentDog.id]} });
      const childrenIds = children.map((child) => child.id);
      if (!children) {
        console.log(`Couldn't locate children: ${ currentDog.name }`);
      } else {
        currentDog.children = childrenIds;
      }

    }

    // Apply intake date if not present and date exists in entry
    if (!currentDog.intakeDate) {
      const formattedDate = formatDate(intakeDate_raw);
      if (formattedDate) {
        currentDog.intakeDate = formattedDate;
      }
    }

    // Apply previous location if not present and exists in entry
    if (
      !currentDog.origin &&
      previousLocation_raw &&
      !previousLocation_raw.includes('N/A')
    ) {
      currentDog.origin = previousLocation_raw.toLowerCase();
    }

    // Apply additional history notes if not present and exists in entry
    if (
      !currentDog.history &&
      additionalHistory_raw &&
      !additionalHistory_raw.includes('N/A')
    ) {
      currentDog.history = additionalHistory_raw;
    }

    await applyLinkedCoordinator(
      fosterCoordEmail_raw,
      'fosterCoordinator',
      currentDog
    );
    await applyLinkedCoordinator(
      vettingCoordEmail_raw,
      'vettingCoordinator',
      currentDog
    );
    await applyLinkedCoordinator(
      adoptionCoordEmail_raw,
      'adoptionCoordinator',
      currentDog
    );

    // Apply birthday
    if (birthday_raw && !birthday_raw.includes('N/A')) {
      const formattedDate = formatDate(birthday_raw);
      if (!currentDog.birthday && formattedDate) {
        currentDog.birthday = formattedDate;
      }
    }

    // Apply breed
    if (
      typeof breed_raw === 'string' &&
      currentDog.breed.length === 0 &&
      !breed_raw.includes('N/A')

    ) {
      currentDog.breed = [breed_raw.toLowerCase()];
    }

    // Apply weight
    if (!currentDog.weight && !weight_raw.includes('N/A')) {
      let weight = getNumFromStr(weight_raw);
      // Convert from kg to lbs if weight includes kg
      if (weight_raw.toLowerCase().includes('kg')) {
        weight *= 2.20462;
      }
      if (weight) {
        currentDog.weight = Number(weight);
      }
    }

    // Apply Sex
    if (!currentDog.sex && !sex_raw.includes('N/A')) {
      if (sex_raw.toUpperCase() === 'M') {
        currentDog.sex = 'M';
      } else if (sex_raw.toUpperCase() === 'F') {
        currentDog.sex = 'F';
      }
    }

    // Apply dhpp1 date
    if (!currentDog.vettingDates.dhpp1) {
      const dhpp1_date = formatDate(DHPP1Date_raw);
      if (dhpp1_date) {
        currentDog.vettingDates.dhpp1 = dhpp1_date;
      }
    }

    // Apply dhpp2 date
    if (!currentDog.vettingDates.dhpp2) {
      const dhpp2_date = formatDate(DHPP2Date_raw);
      if (dhpp2_date) {
        currentDog.vettingDates.dhpp2 = dhpp2_date;
      }
    }
    // Apply dhlpp3 date
    if (!currentDog.vettingDates.dhlpp3) {
      const dhlpp3_date = formatDate(DHLPP3Date_raw);
      if (dhlpp3_date) {
        currentDog.vettingDates.dhlpp3 = dhlpp3_date;
      }
    }
    // Apply bordetella date
    if (!currentDog.vettingDates.bordetella) {
      const bordetella_date = formatDate(bordetellaDate_raw);
      if (bordetella_date) {
        currentDog.vettingDates.bordetella = bordetella_date;
      }
    }
    // Apply rabies date
    if (!currentDog.vettingDates.rabies) {
      const rabies_date = formatDate(rabiesDate_raw);
      if (rabies_date) {
        currentDog.vettingDates.rabies = rabies_date;
      }
    }

    // Apply microchip date
    if (!currentDog.vettingDates.microchip) {
      const microchip_date = formatDate(microchipDate_raw);
      if (microchip_date) {
        currentDog.vettingDates.microchip = microchip_date;
      }
    }

    // Apply fix and fix date
    if (!currentDog.vettingDates.fixed) {
      const fixedDate = formatDate(fixEntry_raw);
      if (fixedDate) {
        currentDog.vettingDates.fixed = fixedDate;
        if (moment(fixedDate).isBefore(Date.now())) {
          currentDog.isFixed = true;
        }
      } else if (
        fixEntry_raw.includes('prior') ||
        fixEntry_raw.includes('y') ||
        fixEntry_raw.includes('done')
      ) {
        currentDog.isFixed = true;
      } else if (fixEntry_raw === 'n' || fixEntry_raw === 'no') {
        currentDog.isFixed = false;
      }
    }

    switch (vettingStatus_raw) {
      case 'Intake':
        if (
          currentDog.status.length === 0 ||
          !currentDog.status.includes('intake')
        ) {
          currentDog.status = [...currentDog.status, 'intake'];
        }
        if (
          currentDog.vettingStatus.length === 0 ||
          !currentDog.vettingStatus.includes('incomplete')
        ) {
          currentDog.vettingStatus = [...currentDog.vettingStatus, 'incomplete'];
        }
        break;
      case 'On Hold - ALL':
        if (
          currentDog.status.length === 0 ||
          !currentDog.status.includes('foster')
        ) {
          currentDog.status = [...currentDog.status, 'foster'];
        }
        if (
          currentDog.status.length === 0 ||
          !currentDog.status.includes('on hold - all')
        ) {
          currentDog.status = [...currentDog.status, 'on hold - all'];
        }
        break;
      case 'In Foster - Vetting Outstanding':
        if (
          currentDog.status.length === 0 ||
          !currentDog.status.includes('foster')
        ) {
          currentDog.status = [...currentDog.status, 'foster'];
        }
        if (
          currentDog.vettingStatus.length === 0 ||
          !currentDog.vettingStatus.includes('incomplete')
        ) {
          currentDog.vettingStatus = [...currentDog.vettingStatus, 'incomplete'];
        }
        break;
      case 'Adopted - Pending Records':
        if (
          !currentDog.status.length === 0 ||
          !currentDog.status.includes('adopted')
        ) {
          currentDog.status = [...currentDog.status, 'adopted'];
        }
        if (currentDog.status.length > 0) {
          currentDog.status = currentDog.status.filter((e) => e !== "foster")
        }
        if (
          currentDog.vettingStatus.length === 0 ||
          !currentDog.vettingStatus.includes('pending records')
        ) {
          currentDog.vettingStatus = [...currentDog.vettingStatus, 'pending records'];
        }
        break;
      case 'Adopted - Vetting Complete':
        if (
          currentDog.status.length === 0 ||
          !currentDog.status.includes('adopted')
        ) {
          currentDog.status = [...currentDog.status, 'adopted'];
        }
        if (currentDog.status.length > 0) {
          currentDog.status = currentDog.status.filter((e) => e !== "foster")
        }
        currentDog.vettingStatus = ['complete'];
        break;
      case 'Adopted - Vetting Outstanding':
        if (
          currentDog.status.length === 0 ||
          !currentDog.status.includes('adopted')
        ) {
          currentDog.status = [...currentDog.status, 'adopted'];
        }
        if (currentDog.status.length > 0) {
          currentDog.status = currentDog.status.filter((e) => e !== "foster")
        }
        currentDog.vettingStatus = ['incomplete'];
        break;
      case 'Deceased':
        currentDog.status = ['deceased'];
        currentDog.vettingStatus = ['deceased'];
    }

    //SAVE OR LOG
    // await currentDog.save();

  } catch (e) {
    console.error(e);
  }
});

