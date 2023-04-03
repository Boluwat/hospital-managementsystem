const mongoose = require('mongoose');
const { validatePatient } = require('../patients/validate');
const { validateHospital } = require('../hospital/validate');

const wardSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  capacity: {
    type: Number,
  },
  roomStatus: {
    type: Boolean,
    default: true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    index: true,
    required: true,
    validate: validateHospital,
  },
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      index: true,
      sparse: true,
      default: [],
      validate: validatePatient,
    },
  ],

}, { strict: 'throw', timestamps: true });

// eslint-disable-next-line prefer-arrow-callback, func-names
// wardSchema.virtual('capacity').get(function () {
//   return 3 - this.patients.length;
// });

const WardRoom = mongoose.model('WardRoom', wardSchema);
module.exports = {
  WardRoom,
};
