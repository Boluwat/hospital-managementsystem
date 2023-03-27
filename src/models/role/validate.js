const mongoose = require('mongoose');

async function validateRole(val) {
  const Role = mongoose.model('Role');
  try {
    const role = await Role.findById(val).lean().exec();
    return Boolean(role);
  } catch (ex) {
    return false;
  }
}

module.exports = {
  validateRole,
};
