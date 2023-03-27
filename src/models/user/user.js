const mongoose = require('mongoose');
const { validateRole } = require('../role/validate');
const { validateHospital } = require('../hospital/validate');

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: {
        unique: true,
      },
    },
    isHospitalMgt: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: String,
      required: true,
      index: {
        unique: true,
      },
    },
    activated: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE'],
    },
    dob: {
      type: Date,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      index: true,
      validate: validateRole,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      index: true,
      sparse: true,
      validate: validateHospital,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    state: {
      type: String,
    },
    status: {
      type: String,
      default: 'INACTIVE',
      enum: ['ACTIVE', 'INACTIVE', 'TERMINATED'],
    },
  },
  { strict: 'throw', timestamps: true },
);

const User = mongoose.model('User', userSchema);
module.exports = {
  User,
};
