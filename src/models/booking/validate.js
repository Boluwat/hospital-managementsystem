const mongoose = require('mongoose');

async function validateAppointment(val) {
  const Appointment= mongoose.model('Appointment');
  try {
    const appointment = await Appointment.findById(val).lean().exec();
    return Boolean(appointment);
  } catch (ex) {
    return false;
  }
}

module.exports = {
    validateAppointment
}