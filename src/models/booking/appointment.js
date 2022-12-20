const mongoose = require("mongoose");
const { validatePatient } = require("../patients/validate");
const { validateDepartment } = require("../department/validate");
const { validateHospital } = require("../hospital/validate");
const { validateEmployee } = require("../employee/validate");

const bookingSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      index: true,
      sparse: true,
      validate: validateHospital,
    },
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        index: true,
        sparse: true,
        // validate: validateDepartment,
      },
    ],
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      index: true,
      required: true,
      validate: validatePatient,
    },
    date: {
      type: String,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
      sparse: true,
      validate: validateEmployee,
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Cancelled"],
    },
  },
  { strict: "throw", timestamps: true }
);

const Appointment = mongoose.model("Appointment", bookingSchema);
module.exports = {
  Appointment,
};
