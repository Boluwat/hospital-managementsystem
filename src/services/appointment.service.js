const { isValidObjectId } = require("mongoose");
const constants = require("../utils/constant");
const logger = require("../lib/logger");
const { Appointment } = require("../models/booking");

module.exports = {
  appointmentService() {
    return {
      async create(payload, patient) {
        try {
          payload.patient = patient;
          const booking = await Appointment.create(payload);

          if (!booking) {
            return { error: constants.GONE_BAD };
          }
          return { msg: constants.SUCCESS, appointmentId: booking._id };
        } catch (error) {
          logger.log({
            level: "error",
            message: error,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async getById(id, patient) {
        if (!isValidObjectId(id)) return { error: constants.NOT_FOUND };
        const booking = await Appointment.findOne({
          _id: id,
          patient,
        }).populate("patient doctor", "fullname hospital cardNo, lastname");
        if (!booking) {
          return { error: constants.NOT_FOUND };
        }
        return booking;
      },
      async getAll({
        offset = 0,
        limit = 100,
        status,
        date,
        hospital,
        departments,
      } = {}) {
        try {
          const query = {};
          if (status) {
            query.status = status;
          }
          if (date) {
            query.date = date;
          }
          if (hospital) {
            query.hospital = hospital;
          }
          if (departments) {
            query.departments = departments;
          }
          const totalCounts = await Appointment.countDocuments(query);
          const value = await Appointment.find(query)
            .skip(offset)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("patient doctor", "fullname hospital cardNo lastname");
          return {
            totalCounts,
            value,
          };
        } catch (error) {
          logger.log({
            level: "error",
            message: error,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async update(id, payload) {
        try {
          if (!isValidObjectId(id)) return { error: constants.NOT_FOUND };

          const booking = await Appointment.findOneAndUpdate(
            { _id: id },
            payload,
            { new: true }
          );

          if (!booking) return { error: constants.NOT_FOUND };
          return booking;
        } catch (error) {
          logger.log({
            level: "error",
            message: error,
          });
          return { error: constants.GONE_BAD };
        }
      },
    };
  },
};
