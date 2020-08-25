const Dog = require('../models/Dog');
const Person = require('../models/Person');
const connectDB = require('../config/db');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
connectDB();


// // Edit status and vetting status arrays
// const editDB = async () => {
//   const dogs = await Dog.find();
//   dogs.forEach( (dog) => {
//       // if (dog.status.length > 0) {
//       //   if (dog.status.includes('deceased')) {
//       //     dog.status = 'deceased';
//       //   } else if (dog.status.includes('adopted')) {
//       //     dog.status = 'adopted';
//       //   } else if (dog.status.includes('intake')) {
//       //     dog.status = 'intake';
//       //   } else if (dog.status.includes('on hold - all')) {
//       //     dog.status = 'hold';
//       //   } else if (dog.status.includes('fta')) {
//       //     dog.status = 'fta';
//       //   } else {
//       //     dog.status = 'fostered'
//       //   }
//       // } else {
//       //   dog.status = '';
//       // }
//       //
//       // if (dog.vettingStatus.length > 0) {
//       //   if (dog.vettingStatus.includes('deceased')) {
//       //     dog.vettingStatus = 'deceased';
//       //   } else if (dog.vettingStatus.includes('complete')) {
//       //     dog.vettingStatus = 'complete';
//       //   } else if (dog.vettingStatus.includes('incomplete')) {
//       //     dog.vettingStatus = 'incomplete';
//       //   } else if (dog.vettingStatus.includes('pending records')) {
//       //     dog.vettingStatus = 'pendingrecords';
//       //   }
//       // } else {
//       //   dog.vettingStatus = '';
//       // }
//       if (Array.isArray(dog.status) && dog.status.length === 0) {
//         dog.set('status', undefined);
//       }
//       if (Array.isArray(dog.vettingStatus) && dog.vettingStatus.length === 0) {
//         dog.set('vettingStatus', undefined);
//       }
//       // dog.save();
//   })
// }
// editDB();

// // log unique status items;
// const logWrapper = async () => {
//   const uniqueStatus_array = [];
//   const log = async () => {
//     const dogs = await Dog.find();
//     dogs.forEach((dog) => {
//       dog.status.forEach((el) => {
//         if (!uniqueStatus_array.includes(el)) {
//           uniqueStatus_array.push(el)
//         }
//       })
//     })
//   }
//   await log();
//   console.log(uniqueStatus_array);
// }
// logWrapper();

//
// // Remove 'taken' as a dog status and replace 'foster' with 'fostered'
// const editDB = async () => {
//   const dogs = await Dog.find();
//   dogs.forEach( (dog) => {
//     if (dog.status.length > 0) {
//       if (dog.status.indexOf('foster') !== -1) {
//         dog.status.splice(dog.status.indexOf('foster'));
//         dog.status.push('fostered');
//        //dog.save();
//       }
//     }
//   })
// }
// editDB();

