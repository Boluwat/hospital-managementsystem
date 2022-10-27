const { isValidObjectId } = require("mongoose");
const { Employee } = require("../models/employee");
const logger = require("../lib/logger");
const constants = require("../utils/constant");

module.exports = {
  employeeService() {
    return {
      async create(payload, hospital, user) {
        try {
          const employee = await Employee.findOne({
            email: payload.email,
          });
          if (employee) {
            return {
              error: constants.EXIST,
            };
          }
          payload.hospital = hospital;
          payload.user = user;
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
      async getAll({ offset = 0, limit = 100, status, employementType } = {}) {
        const query = {};
        if (status) {
          query.status = status;
        }
        if (employementType) {
          query.employementType = employementType;
        }
        const totalCounts = await Employee.countDocuments(query);
        const value = await Employee.find(query)
          .populate("hospital user", "hosptalName firstname, lastname")
          .skip(offset)
          .sort({ createdAt: -1 })
          .limit(limit);
        return {
          totalCounts,
          value,
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
      async update(id, payload) {
        try {
          if (!isValidObjectId(id)) return { error: constants.NOT_FOUND };
          const employee = await Employee.findOneAndUpdate(
            {
              _id: id,
            },
            payload,
            {
              new: true,
            }
          ).populate("hospital", "hospitalName");
          if (!employee) return { error: constants.NOT_FOUND };
          return employee;
        } catch (error) {
          logger.log({
            level: "error",
            message: error,
          });
        }
        return { error: constants.GONE_BAD };
      },
      async deactivate(id, hospital) {
        try {
          if (!isValidObjectId(id)) return { error: constants.NOT_FOUND };
          const employee = await Employee.findOneAndUpdate(
            {
              _id:id,
              hospital
            },
            {status: "TERMINATED"},
            {new: true}
          )
         if(!employee) return {error: constants.NOT_FOUND}
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
