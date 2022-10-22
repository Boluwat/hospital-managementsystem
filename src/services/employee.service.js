const { isValidObjectId } = require("mongoose");
const { Employee } = require("../models/employee");
const logger = require("../lib/logger");
const constants = require("../utils/constant");

module.exports = {
  employeeService() {
    return {
      async create(payload) {
        try {
          const employee = await Employee.findOne({
            email: payload.email,
            mobile: payload.mobile
          });
          if (employee) {
            return {
              error: constants.EXIST,
            };
          }
          await Employee.create(payload);
          return { msg: constants.SUCCESS };
        } catch (ex) {
          logger.log({
            level: "error",
            message: ex,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async getAll({
        offset = 0,
        limit = 100,
        status,
        hospital,
        user,
        employementType,
      } = {}) {
        if (!isValidObjectId(hospital)) return { error: constants.NOT_FOUND };
        if (!isValidObjectId(user)) return { error: constants.NOT_FOUND };
        const query = {};
        if (hospital) {
          query.hospital = hospital;
        }
        if (user) {
          query.user = user;
        }
        if (status || status === false) {
          query.status = status;
        }
        if (employementType) {
          query.employementType = employementType;
        }
        const totalCounts = await Employee.countDocuments(query);
        const response = await Employee.find(query)
          .populate("hospital user", "hosptalName firstname, lastname")
          .skip(offset)
          .sort({ createdAt: -1 })
          .limit(limit);
        return {
          totalCounts,
          response,
        };
      },
      async getById(id, hospital) {
        if (!isValidObjectId(id)) return { error: constants.NOT_FOUND };
        const employee = await Employee.findOne({
          _id: id,
          hospital,
        }).populate("hospital user", "hospitalName firstname lastname");
        if (!employee) return { error: constants.NOT_FOUND };
        return employee;
      },
      async update(payload, id, hospital) {
        try {
          if (!isValidObjectId(id)) return { error: constants.NOT_FOUND };
          const employee = await Employee.findOneAndUpdate(
            {
              _id: id,
              hospital,
            },
            payload,
            {
              new: true,
            }
          ).populate("hospital user", "hospitalName firstname lastname");
          if (employee) {
            return { employee };
          }
          return { error: constants.NOT_FOUND };
        } catch (error) {
          logger.log({
            level: "error",
            message: error,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async deactivate(employeeId) {
        try {
          if (!isValidObjectId(employeeId))
            return { error: constants.NOT_FOUND };
          const employee = await Employee.findById(employeeId);
          if (!employee) return { error: constants.NOT_FOUND };
          await Employee.findByIdAndUpdate(
            {
              _id: employeeId,
            },
            { status: false },
            { new: true }
          );
          return { msg: constants.SUCCESS };
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
