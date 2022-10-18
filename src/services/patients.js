const { isValidObjectId } = require("mongoose");
const { Hospital } = require("../models/hospital");
const { Patients } = require("../models/patients");
const logger = require("../lib/logger");
const constants = require("../utils/constant");
const { hashManager } = require("../utils/bcrypt");
const { sign } = require("../utils/tokenizer");
const hospital = require("../models/hospital");

async function checkIfPatientExist(patient) {
  const patientExist = await Patients.findOne({
    $or: [{ fullname: patient.fullname }, { email: patient.email }],
  });
  return patientExist;
}

async function getResponse(patient) {
  patient = patient.toObject();
  const option = {};
  delete patient.password;
  delete patient.token;

  return {
    patient,
    token: await sign({
      patient: patient._id,
      ...option,
      email: patient.email,
      name: patient.fullname,
    }),
  };
}

module.exports = {
  patientService() {
    return {
      async signUpPatient(patient, hospital) {
        try {
          const validated = await checkIfPatientExist(patient);
          if (!validated) {
            const token =
              Math.floor(Math.random() * 90000) + constants.TOKEN_RANGE;
            patient.token = token;
            patient.password = await hashManager().hash(patient.password);
            patient.hospital = hospital;
            const newPatient = await Patients.create(patient);
            return {
              msg: constants.SUCCESS,
              patientId: newPatient._id,
            };
          }
          return { message: constants.DUPLICATE_USER };
        } catch (error) {
          logger.log({
            level: "error",
            message: error,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async signInPatient(patient) {
        try {
          const dbUser = await Patients.findOne({
            $or: [{ email: patient.email }, { mobile: patient.mobile }],
          });
          if (!dbUser) {
            return { msg: constants.INVALID_USER };
          }
          const { _id } = dbUser;
          const validatePassword = await hashManager().compare(
            patient.password,
            dbUser.password
          );
          if (dbUser && validatePassword) {
            if (!dbUser.activated) {
              const token =
                Math.floor(Math.random() * 90000) + constants.TOKEN_RANGE;
              await Patients.findOneAndUpdate(
                {
                  $or: [{ email: patient.email }, { mobile: patient.mobile }],
                },
                { token },
                { new: true }
              );
              return {
                error: {
                  activated: false,
                  patientId: _id,
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
        } catch (error) {
          logger.log({
            level: "error",
            message: error,
          });
          throw new Error(error.message);
        }
      },
      async activatePatient(id, token) {
        try {
          if (!isValidObjectId(id)) return constants.NOT_FOUND;
          const updatePatient = await Patients.findOneAndUpdate(
            {
              _id: id,
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

          if (updatePatient) {
            return await getResponse(updatePatient);
          }
          return { error: constants.INVALID_TOKEN };
        } catch (error) {
          logger.log({
            level: "error",
            message: error,
          });
          return { error: constants.GONE_BAD };
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
        const totalCounts = await Patients.countDocuments(query);
        const value = [];
        const response = await Patients.find(query)
          .populate("hospital", "_id hospitalName")
          .select()
          .skip(offset)
          .sort({ createdAt: -1 })
          .limit(limit);
        for (let index = 0; index < response.length; index += 1) {
          value.push((await getResponse(response[index])).patient);
        }
        return {
          totalCounts,
          value,
        };
      },
      async getPatientByID(id) {
        try {
          if (!isValidObjectId(id)) return constants.NOT_FOUND;
          const patient = await Patients.findById(id);
          if (!patient) {
            return {
              error: constants.NOT_FOUND,
            };
          }
          return (await getResponse(patient)).patient;
        } catch (error) {
          logger.log({
            level: "error",
            message: error,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async resetPassword({ newPassword }, id) {
        try {
          if (!isValidObjectId(id)) return constants.NOT_FOUND;
          const password = await hashManager().hash(newPassword);
          const updatePatient = await Patients.findOneAndUpdate(
            { _id: id },
            { password },
            { new: true }
          );
          if (updatePatient) {
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
      async updatePatient(patient, patientId) {
        try {
          if (!isValidObjectId(patientId)) return constants.NOT_FOUND;
          const updatePatient = await Patients.findOneAndUpdate(
            { _id: patientId },
            patient,
            { new: true }
          );
          if (updatePatient) {
            return (await getResponse(updatePatient)).patient;
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
      async deletePatient(patientId) {
        try {
          if (!isValidObjectId(patientId)) return constants.NOT_FOUND;
          const patient = await Patients.findOne({ _id: patientId });
          if (patient) {
            await Patients.findOneAndUpdate(
              { _id: patientId },
              { status: "INACTIVE", activated: false }
            );
            return { msg: constants.SUCCESS };
          }
          return { message: constants.INVALID_USER };
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
