const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

const Department = mongoose.model('Department', departmentSchema);
module.exports = {
  Department,
};
