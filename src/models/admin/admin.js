const mongoose = require('mongoose');
const { validateRole } = require('../role/validate');

const adminSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    status: {
      type: String,
      default: 'INACTIVE',
      enum: ['ACTIVE', 'INACTIVE', 'TERMINATED'],
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      index: true,
      validate: validateRole,
    },
  },

  { strict: 'throw', timestamps: true },
);

const Admin = mongoose.model('Admin', adminSchema);
module.exports = {
  Admin,
};
