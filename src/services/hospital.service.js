const config = require("config");
const { isValidObjectId } = require("mongoose");
const { Hospital } = require("../models/hospital");
const { User } = require("../models/user");
const logger = require("../lib/logger");
const constants = require("../utils/constant");

async function checkIfHospitalExist(hospital) {
  const hospitalExist = await Hospital.findOne({
    $or: [{ email: hospital.email }, { mobile: hospital.mobile }],
  });
  return hospitalExist;
}

module.exports = {
  hospitalService() {
    return {
      async signupHospital(hospital) {
        try {
          const validate = await checkIfHospitalExist(hospital);
          if (!validate) {
            const newHospital = await Hospital.create(hospital);
            const { _id: hospitalId, users } = newHospital;
            await User.findByIdAndUpdate(users[0], { hospital: hospitalId });
            return {
              msg: constants.SUCCESS,
              hospitalId,
            };
          }
          return { error: constants.DUPLICATE_HOSPITAL };
        } catch (ex) {
          logger.log({
            level: "error",
            message: ex,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async getAll({ offset = 0, limit = 100, status } = {}) {
        const query = {};
        if (status) {
          query.status = status;
        }
        const totalCounts = await Hospital.countDocuments(query);
        const response = await Hospital.find(query)
          .select()
          .skip(offset)
          .sort({ createdAt: -1 })
          .limit(limit);

        return {
          totalCounts,
          response,
        };
      },
      async getHospitalById(hospitalId) {
        try {
          if (!isValidObjectId(hospitalId)) return constants.NOT_FOUND;
          const hospital = await Hospital.findById(hospitalId).populate(
            "users",
            "fistname lastname"
          );
          if (!hospital) {
            return {
              error: constants.NOT_FOUND,
            };
          }
          return hospital;
        } catch (ex) {
          logger.log({
            level: "error",
            message: ex,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async updateHospital(hospitalId, payload) {
        if (!isValidObjectId(hospitalId)) return constants.NOT_FOUND;
        const hospitalUpdate = await Hospital.findOneAndUpdate(
          {
            _id: hospitalId,
          },
          payload,
          {
            new: true,
          }
        );

        if (hospitalUpdate) {
          return { hospitalUpdate };
        }
        return { error: constants.NOT_FOUND };
      },
      async deactivateAccount(hospitalId, password) {
        try {
          if (!isValidObjectId(hospitalId)) return constants.NOT_FOUND;
          const hospital = await Hospital.findById(hospitalId);
          if (!hospital) return { error: constants.NOT_FOUND };
          const validatePassword = await hashManager().compare(
            password,
            user.password
          );
          if (validatePassword) {
            const updatedhopital = await Hospital.findOneAndUpdate(
              {
                _id: hospitalId,
              },
              {
                status: "INACTIVE",
              },
              {
                new: true,
              }
            );
            if (updatedhopital) {
              return { response: constants.SUCCESS };
            }
          }
          return { error: constants.INVALID_USER };
        } catch (ex) {
          logger.log({
            level: "error",
            message: ex,
          });
        }
      },
    };
  },
};
