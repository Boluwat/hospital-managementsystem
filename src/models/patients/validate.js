const mongoose = require('mongoose');

async function validatePatient(val) {
  const Patients= mongoose.model('Patient');
  try {
    const patient = await Patients.findById(val).lean().exec();
    return Boolean(patient);
  } catch (ex) {
    return false;
  }
}

module.exports = {
    validatePatient
};