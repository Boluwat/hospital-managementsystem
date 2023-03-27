/* eslint-disable consistent-return */
const { isValidObjectId } = require('mongoose');
const logger = require('../lib/logger');
const { Role } = require('../models/role/index');
const constants = require('../utils/constant');

module.exports = {
  roleService() {
    return {
      async create(payload) {
        try {
          const role = await Role.findOne({ name: payload.name });
          if (role) {
            return {
              error: constants.EXIST,
            };
          }
          await Role.create(payload);
          return { message: constants.SUCCESS };
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex,
          });
        }
      },
      async getAll({ offset = 0, limit = 100, status = true } = {}) {
        const query = {};
        if (status) {
          query.status = status;
        }
        const totalCounts = await Role.countDocuments(query);
        const value = await Role.find(query)
          .skip(offset)
          .sort({ createdAt: -1 })
          .limit(limit);
        return {
          value,
          totalCounts,
        };
      },
      async getById(id) {
        if (!isValidObjectId(id)) return { error: constants.NOT_FOUND };
        const role = await Role.findById(id);
        if (!role) return { error: constants.NOT_FOUND };
        return role;
      },
      async update(payload, id) {
        try {
          if (!isValidObjectId(id)) return { error: constants.NOT_FOUND };
          const role = await Role.findOneAndUpdate(
            {
              _id: id,
            },
            payload,
            {
              new: true,
            },
          );
          if (!role) return { error: constants.NOT_FOUND };
          return role;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async deactivate(roleId) {
        try {
          if (!isValidObjectId(roleId)) return { error: constants.NOT_FOUND };
          const role = await Role.findById(roleId);
          if (!role) return { error: constants.NOT_FOUND };
          await Role.findOneAndUpdate(
            {
              _id: roleId,
            },
            { status: false },
            { new: true },
          );
          return constants.SUCCESS;
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex,
          });
          return { error: constants.GONE_BAD };
        }
      },
    };
  },
};
