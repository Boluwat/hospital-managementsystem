const mongoose = require('mongoose');

async function validateDepartment(val) {
  const Department= mongoose.model('Department');
  try {
    const department = await Department.findById(val).lean().exec();
    return Boolean(department);
  } catch (ex) {
    return false;
  }
}

module.exports = {
    validateDepartment
}