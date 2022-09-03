const config = require("config");
const { isValidObjectId } = require("mongoose");
const logger = require("../lib/logger");
const { User } = require("../models/user");
const constants = require("../utils/constant");
const { hashManager } = require("../utils/bcrypt");
const { sign } = require("../utils/tokenizer");

async function getResponse(user) {
  const { hospitalService } = require(".");
  let onboardingDone = true;
  if (user.role.toString() === config.migrationIDS.HOSPITAL_ADMIN_ID) {
    const hospital = await hospitalService().getHospitalById(user.hospital);
    onboardingDone = !hospital;
  }
  user = user.toObject();
  const option = {};
  delete user.password;
  delete user.role;
  delete user.token;
  if (!user.isHospitalMgt) delete user.hospital;
  // if (user.isHospitalMgt) option.hospital = user.hospital._id;
  delete user.isAdmin;

  return {
    user,
    onboardingDone,
    token: await sign({
      user: user._id,
      ...option,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    }),
  };
}

async function checkUserExist(user) {
  const userExist = await User.findOne({
    $or: [{ email: user.email }, { mobile: user.email }],
  });
  return userExist;
}

module.exports = {
  userService() {
    return {
      async isAdmin(type, user, hospital) {
        if (!isValidObjectId(user)) return false;
        if (type !== "main" && !isValidObjectId(hospital)) return false;
        const query = {
          _id: user,
          status: "ACTIVE",
        };
        if (type == "main") {
          query.role = { $in: config.migrationIDS.ADMIN_ROLE_IDS };
          query.isAdmin = true;
        } else {
          query.role = config.migrationIDS.HOSPITAL_ADMIN_ID;
          query.issHospitalMgt = true;
          query.hospital = hospital;
        }
        const admin = await User.findOne(query);
        return admin;
      },
      async signUpUser(user) {
        try {
          const validation = await checkUserExist(user);
          if (!validation) {
            const token =
              Math.floor(Math.random() * 90000) + constants.TOKEN_RANGE;
            user.token = token;
            if (!user.password) user.password = user.email;
            user.password = await hashManager().hash(user.password);
            const newUser = await User.create(user);
            return {
              msg: constants.SUCCESS,
              userId: newUser._id,
            };
          }
          return { error: constants.DUPLICATE_USER };
        } catch (ex) {
          logger.log({
            level: "error",
            message: ex,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async activateUser(userId, token) {
        try {
          if (!isValidObjectId(userId)) return constants.NOT_FOUND;
          const updateUser = await User.findOneAndUpdate(
            {
              _id: userId,
              token,
              activated: false,
            },
            {
              activated: true,
              status: "ACTIVE",
            },
            {
              new: true,
            }
          ).populate("hospital", "_id hospitalName");

          if (updateUser) {
            return await getResponse(updateUser);
          }
          return { error: constants.INVALID_TOKEN };
        } catch (ex) {
          logger.log({
            level: "error",
            message: ex,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async signInUser(user) {
        try {
          const dbUser = await User.findOne({
            $or: [
              { email: user.userEmailMobile },
              { mobile: user.userEmailMobile },
            ],
          }).populate("hospital", "_id hospitalName");

          if (!dbUser) {
            return { error: constants.INVALID_USER };
          }
          const { _id } = dbUser;
          const validatePassword = await hashManager().compare(
            user.password,
            dbUser.password
          );
          if (dbUser && validatePassword) {
            if (!dbUser.activated) {
              const token =
                Math.floor(Math.random() * 90000) + constants.TOKEN_RANGE;
              await User.findOneAndUpdate(
                {
                  $or: [
                    { email: user.userEmailMobile },
                    { mobile: user.userEmailMobile },
                  ],
                },
                { token },
                { new: true }
              );
              return {
                error: {
                  activated: false,
                  userId: _id,
                  msg: constants.ACCOUNT_NOT_ACTIVATED,
                },
              };
            }
            await dbUser.save();
            return await getResponse(dbUser);
          }
          return {
            error: constants.INVALID_USER,
          };
        } catch (ex) {
          logger.log({
            level: "error",
            message: ex,
          });
          throw new Error(ex.message);
        }
      },
      async getAll({ offset = 0, limit = 100, status, activated } = {}) {
        const query = {};
        if (status) {
          query.status = status;
        }
        if (activated) {
          query.activated = activated;
        }
        const totalCounts = await User.countDocuments(query);
        const value = [];
        const response = await User.find(query)
          .populate("hospital", "_id hospitalName")
          .select()
          .skip(offset)
          .sort({ createdAt: -1 })
          .limit(limit);
        for (let index = 0; index < response.length; index += 1) {
          value.push((await getResponse(response[index])).user);
        }
        return {
          totalCounts,
          value,
        };
      },
      async getUserByID(userId) {
        try {
          if (!isValidObjectId(userId)) return constants.NOT_FOUND;
          const user = await User.findById(userId);
          if (!user) {
            return {
              error: constants.NOT_FOUND,
            };
          }
          return (await getResponse(user)).user;
        } catch (error) {
          logger.log({
            level: "error",
            message: error,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async resetPassword({ newPassword }, userId) {
        try {
          if (!isValidObjectId(userId)) return constants.NOT_FOUND;
          const password = await hashManager().hash(newPassword);
          const updateUser = await User.findOneAndUpdate(
            { _id: userId },
            { password },
            { new: true }
          );
          if (updateUser) {
            return { msg: constants.SUCCESS };
          }
          return { error: constants.GONE_BAD };
        } catch (error) {
          logger.log({
            level: "error",
            message: error,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async updateUser(user, userId) {
        try {
          if (!isValidObjectId(userId)) return constants.NOT_FOUND;
          const updateUser = await User.findOneAndUpdate(
            { _id: userId },
            user,
            { new: true }
          );
          if (updateUser) {
            return (await getResponse(updateUser)).user;
          }
          return { error: constants.INVALID_USER };
        } catch (error) {
          logger.log({
            level: "error",
            message: error,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async deleteUser(userId, password) {
        try {
          if (!isValidObjectId(userId)) return constants.NOT_FOUND;
          const user = await User.findById(userId);
          if (!user) {
            return { message: constants.INVALID_USER };
          }
          const validatePassword = await hashManager().compare(
            password,
            user.password
          );
          if (validatePassword) {
            const updateUser = await User.findOneAndUpdate(
              { _id: userId },
              { status: "INACTIVE", activated: false },
              { new: true }
            );
            if (updateUser) {
              return { msg: constants.SUCCESS };
            }
          }
          return { error: constants.INVALID_USER };
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
