const mongoose = require("mongoose");
const { validateUser } = require("../user/validate");
const { validateHospital } = require("../hospital/validate");
const { validateRole } = require("../role/validate");

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
      validate: validateUser,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      index: true,
      required: true,
      validate: validateHospital,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      index: true,
      required: true,
      validate: validateRole,
    },
    employementType: {
      type: String,
      enum: ["CONTRACT", "FULLTIME"],
    },
    email: {
      type: String,
      required: true,
      index: {
        unique: true,
      },
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { strict: "throw", timestamps: true }
);

const Employee = mongoose.model('Employee', employeeSchema)
module.exports = {
    Employee
}