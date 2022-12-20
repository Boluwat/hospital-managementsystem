const mongoose = require("mongoose");
const { validateHospital } = require("../hospital/validate");

const patientSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    activated: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    state: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
    },
    status: {
      type: String,
      default: "INACTIVE",
      enum: ["ACTIVE", "INACTIVE"],
    },
    token: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    occupation: {
      type: String,
    },
    cardNo: {
      type: String,
      unique: true
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      index: true,
      validate: validateHospital,
    },
  },
  { strict: "throw", timestamps: true }
);

const Patients = mongoose.model("Patient", patientSchema);
module.exports = {
  Patients,
};
