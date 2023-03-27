/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { isValidObjectId } = require('mongoose');
const config = require('config');
const { Admin } = require('../models/admin');
const logger = require('../lib/logger');
const constants = require('../utils/constant');
const { hashManager } = require('../utils/bcrypt');
const { sign } = require('../utils/tokenizer');

async function getResponse(admin) {
  admin = admin.toObject();
  const option = {};
  delete admin.password;
  delete admin.token;

  return {
    admin,
    token: await sign({
      admin: admin._id,
      ...option,
      email: admin.email,
      firstname: admin.firstname,
      lastname: admin.lastname,
    }),
  };
}

async function checkIfAdminExist(admin) {
  const adminExist = await Admin.findOne({
    $or: [{ email: admin.email }, { mobile: admin.mobile }],
  });
  return adminExist;
}

module.exports = {
  adminService() {
    return {
      async isAdmin(admin) {
        if (!isValidObjectId(admin)) return false;

        const admins = await Admin.findOne({
          _id: admin,
          role: config.migrationIDS.ADMIN_ROLE_IDS[1],
          status: 'ACTIVE',
        });
        return admins;
      },
      async isSuperAdmin(admin) {
        if (!isValidObjectId(admin)) return false;

        const admins = await Admin.findOne({
          _id: admin,
          role: config.migrationIDS.ADMIN_ROLE_IDS[0],
          status: 'ACTIVE',
        });
        return admins;
      },
      async signupAdmin(admin) {
        try {
          const validate = await checkIfAdminExist(admin);
          if (!validate) {
            const token = Math.floor(Math.random() * 90000) + constants.TOKEN_RANGE;
            admin.token = token;
            if (!admin.password) admin.password = admin.email;
            admin.password = await hashManager().hash(admin.password);
            const newAdmin = await Admin.create(admin);
            return {
              msg: constants.SUCCESS,
              adminId: newAdmin._id,
            };
          }
          return { error: constants.DUPLICATE_USER };
        } catch (error) {
          logger.log({
            level: 'error',
            message: error,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async activateAdmin(adminId, token) {
        try {
          if (!isValidObjectId(adminId)) return { error: constants.NOT_FOUND };
          const updatedAdmin = await Admin.findOneAndUpdate(
            {
              _id: adminId,
              token,
              activated: false,
            },
            {
              activated: true,
              status: 'ACTIVE',
            },
            {
              new: true,
            },
          );

          if (updatedAdmin) {
            return await getResponse(updatedAdmin);
          }
          return { error: constants.INVALID_TOKEN };
        } catch (error) {
          logger.log({
            level: 'error',
            message: error,
          });
          return { error: constants.GONE_BAD };
        }
      },
    };
  },
};
