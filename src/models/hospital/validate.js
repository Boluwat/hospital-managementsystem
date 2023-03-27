const mongoose = require('mongoose');

async function validateHospital(val) {
  const Hospital = mongoose.model('Hospital');
  try {
    const hospital = await Hospital.findById(val).lean().exec();
    return Boolean(hospital);
  } catch (ex) {
    return false;
  }
}

module.exports = {
  validateHospital,
};
