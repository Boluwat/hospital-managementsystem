const mongoose = require('mongoose');
const { validateUser } = require('../user/validate');

const hospitalSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      validate: validateUser,
    },
    mobile: {
      type: String,
      required: true,
      index: {
        unique: true,
      },
    },
    secondaryMobile: {
      type: String,
    },
    state: {
      type: String,
    },
    status: {
      type: String,
      default: 'ACTIVE',
      enum: ['ACTIVE', 'INACTIVE'],
    },
    hospitalAddress: {
      type: String,
    },
    instagramHandle: {
      type: String,
    },
    facebookHandle: {
      type: String,
    },
    twitterHandle: {
      type: String,
    },
    website: {
      type: String,
    },
  },
  { strict: 'throw', timestamps: true },
);

const Hospital = mongoose.model('Hospital', hospitalSchema);
module.exports = {
  Hospital,
};
