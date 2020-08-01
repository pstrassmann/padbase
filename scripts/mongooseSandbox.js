const Dog = require('../models/Dog');
const Person = require('../models/Person');
const connectDB = require('../config/db');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
connectDB();


const logWrapper = async () => {
  const uniqueStatus_array = [];
  const log = async () => {
    const dogs = await Dog.find();
    dogs.forEach((dog) => {
      dog.vettingStatus.forEach((el) => {
        if (!uniqueStatus_array.includes(el)) {
          uniqueStatus_array.push(el)
        }
      })
    })
  }
  await log();
  console.log(uniqueStatus_array);
}
logWrapper();
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

