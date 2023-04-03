const mongoose = require('mongoose');

async function validateWardRoom(val) {
  const WardRoom = mongoose.model('WardRoom');
  try {
    const wardRoom = await WardRoom.findById(val).lean().exec();
    return Boolean(wardRoom);
  } catch (ex) {
    return false;
  }
}

module.exports = {
  validateWardRoom,
};
