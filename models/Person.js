const mongoose = require('mongoose');

const PersonSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickName: String,
  phone: String,
  email: {type: String, required: true, unique: true},
  altEmails: [String],
  password: String,
  address: String,
  status: [String],
  onStaff: {
    type: Boolean,
    default: false,
  },
  team: [String],
  role: [String],
  homeCheck: String,
  notes: String,
});

module.exports = mongoose.model('Person', PersonSchema);
