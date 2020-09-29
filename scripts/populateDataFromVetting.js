const moment = require('moment');
const tapVetting = require('./data/vettingJSON.js');
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

const capitalizeWords = (s) => {
  const re = /(\b[a-z](?!\s))/g;
  const capitalized = s.replace(re, x => x.toUpperCase() );
  return capitalized;
}

const getDogName = (n) => {
  if (!n || typeof n !== 'string' || n === 'N/A') {
    return null;
  }
  let name;
  const rawName = n.toLowerCase();
  const splitName = rawName.split(' ');
  if (splitName.includes('pup:')) {
    name = capitalizeWords(
      splitName.slice(splitName.indexOf('pup:') + 1).join(' ')
    );
  } else if (splitName.includes('(mama)')) {
    name = capitalizeWords(
      splitName.slice(0, splitName.indexOf('(mama)')).join(' ')
    );
  } else {
    name = capitalizeWords(rawName);
  }
  return name;
};

// Given a string, split using multiple delimeters
const multiSplit = (str) => {
  if (typeof str !== 'string' || str === '') return [];
  const strLower = str.toLowerCase();
  const separators = ['\\\+', '-', '/', ',', '&'];
  const tokens = strLower.split(new RegExp(separators.join('|'), 'g'));
  const tokensFormatted = tokens.map(t=>t.trim())
  return (tokensFormatted);
}

tapVetting.forEach(async (entry) => {

  const name_raw = entry["Dog's Name"];
  const mainVet_raw = entry["Main Vet"];
  const vetsUsed_raw = entry["Vets Used"];
  const group_raw = entry['Group Name'];
  const fleaMedBrand_raw = entry["Flea Med Brand"];
  const fleaMedDate_raw = entry["Flea Med Date"];
  const intakeDate_raw = entry["Intake Date"];
  const dewormerDate_raw = entry["Dewormer Date"];
  const tvtPositive_raw = entry['TVT Positive'];
  const fourDXPositive = entry['4dx Positive'];
  const positiveDiseases_raw = entry['Other Disease Postive (Parvo, Distemper, etc)'];
  const notes_raw = entry['NOTES'];

  try {
    const name = getDogName(name_raw);
    // Skip "puppy"s and no name dogs
    if (!name || name.toLowerCase().includes('puppy')) {
      return;
    }

    let currentDog = await Dog.findOne({name});

    // Add new dogs if not present
    if (!currentDog) {
      // console.log(`Could not locate in db...skipping: ${name_raw} / ${name}`);
      return;
      // currentDog = new Dog({
      //   name,
      // })
      //
      // // Apply intake date to new dog
      // if (!intakeDate_raw) {
      //   const intakeDate = formatDate(intakeDate_raw);
      //   if (intakeDate) {
      //     currentDog.intakeDate = intakeDate;
      //   }
      // }
    }

    // Apply flea med date
    if (!currentDog.vettingDates.flea) {
      const flea_date = formatDate(fleaMedDate_raw);
      if (flea_date) {
        currentDog.vettingDates.flea = flea_date;
      }
    }
    // Apply dewormer date
    if (!currentDog.vettingDates.dewormer) {
      const dewormer_date = formatDate(dewormerDate_raw);
      if (dewormer_date) {
        currentDog.vettingDates.dewormer = dewormer_date;
      }
    }
    // Apply current vet
    if (mainVet_raw && mainVet_raw !==  "Blank" && !currentDog.medical.primaryVet) {
      currentDog.medical.primaryVet = mainVet_raw.toLowerCase();
    }

    // Apply all vets used
    const allVetsUsed_array = multiSplit(vetsUsed_raw);
    if (currentDog.medical.allVetsUsed.length === 0 && allVetsUsed_array.length > 0) {
      currentDog.medical.allVetsUsed = allVetsUsed_array;
    }

    // Apply group names
    if (group_raw && !currentDog.group) {
      currentDog.group = group_raw.toLowerCase();
    }

    // Apply flea med brand
    if (fleaMedBrand_raw && !currentDog.medical.fleaMedBrand) {
      currentDog.medical.fleaMedBrand = fleaMedBrand_raw.toLowerCase();
    }

    // Apply tvt boolean
    if (tvtPositive_raw && currentDog.medical.tvt === undefined) {
      if (tvtPositive_raw.toLowerCase() === 'no') {
        currentDog.medical.tvt = false;
      }
      if (tvtPositive_raw.toLowerCase() === 'yes') {
        currentDog.medical.tvt = true;
      }
    }

    // Apply 4Dx boolean
    if (fourDXPositive && currentDog.medical.fourDX === undefined) {
      if (fourDXPositive.toLowerCase() === 'no') {
        currentDog.medical.fourDX = false;
      }
      if (fourDXPositive.toLowerCase() === 'yes') {
        currentDog.medical.fourDX = true;
      }
    }

    // Apply altDisease notes
    if (positiveDiseases_raw && !currentDog.medical.altDiseaseNotes) {
      currentDog.medical.altDiseaseNotes = positiveDiseases_raw;
    }

    // Apply altDisease notes
    if (notes_raw && !currentDog.medical.medNotes) {
      currentDog.medical.medNotes = notes_raw;
    }

    // await currentDog.save();

  } catch (e) {
    console.error(e);
  }
})