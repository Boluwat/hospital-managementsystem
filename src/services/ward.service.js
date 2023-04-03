/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable no-param-reassign */
const { isValidObjectId } = require('mongoose');
const { WardRoom } = require('../models/wards');
const logger = require('../lib/logger');
const constants = require('../utils/constant');

module.exports = {
  wardService() {
    return {
      async create(payload, hospital) {
        try {
          const wardRoom = await WardRoom.findOne({
            name: payload.name,
          });
          if (wardRoom) {
            return {
              error: constants.EXIST,
            };
          }
          payload.hospital = hospital;
          const newWard = await WardRoom.create(payload);
          return { msg: constants.SUCCESS, wardId: newWard._id };
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async admitPatient(wardRoomID, patientId) {
        try {
          const wardRoom = await WardRoom.findById(wardRoomID);

          if (!wardRoom) return { error: constants.NOT_FOUND };

          if (wardRoom.patients.length >= wardRoom.capacity) {
            return { error: 'Ward room is full' };
          }

          if (wardRoom.patients.includes(patientId)) {
            return { error: 'Patient already admitted to ward room' };
          }
          // Check if room is already occupied
          if (wardRoom.roomStatus) {
            // check if the room is partially occupied, and admit patient
            if (wardRoom.patients.length < wardRoom.capacity) {
              wardRoom.patients.push(patientId);
            } else {
              return { error: 'ward room is already occupied' };
            }
          } else {
            // this is saying the room is available
            wardRoom.patients.push(patientId);
            wardRoom.roomStatus = true;
          }
          await wardRoom.save();
          return wardRoom;
        } catch (error) {
          logger.log({
            level: 'error',
            message: error,
          });
          throw new Error(error.message);
        }
      },
      async dischargePatient(wardRoomID, patientId) {
        try {
          const wardRoom = await WardRoom.findById(wardRoomID);
          if (!wardRoom) return { error: constants.NOT_FOUND };

          const patientIndex = wardRoom.patients.indexOf(patientId);
          if (patientIndex === -1) {
            return { error: constants.NOT_FOUND };
          }
          wardRoom.patients.splice(patientIndex, 1);
          await wardRoom.save();
          return wardRoom;
        } catch (error) {
          logger.log({
            level: 'error',
            message: error,
          });
          throw new Error(error.message);
        }
      },
      async getAll({
        offset = 0, limit = 100, roomStatus, name,
      } = {}) {
        try {
          const query = {};
          if (roomStatus) {
            query.roomStatus = roomStatus;
          }
          if (name) {
            query.name = name;
          }
          const totalCounts = await WardRoom.countDocuments(query);
          const value = await WardRoom.find(query)
            .populate('patients hospital', 'fullName email gender hospitalName')
            .limit(limit)
            .skip(offset)
            .sort({ createdAt: -1 });
          return {
            totalCounts,
            value,
          };
        } catch (ex) {
          logger.log({
            level: 'error',
            message: ex,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async getWard(id) {
        try {
          if (!isValidObjectId(id)) return constants.NOT_FOUND;
          const ward = await WardRoom.findById(id)
            .populate('patients hospital', 'fullName email gender hospitalName');
          if (!ward) {
            return {
              error: constants.NOT_FOUND,
            };
          }
          return ward;
        } catch (error) {
          logger.log({
            level: 'error',
            message: error,
          });
          return { error: constants.GONE_BAD };
        }
      },
      async deactivate(wardId) {
        try {
          if (!isValidObjectId(wardId)) return constants.NOT_FOUND;
          const ward = await WardRoom.findOne({ _id: wardId });
          if (ward) {
            await WardRoom.findOneAndUpdate(
              { _id: wardId },
              { availableStatus: false },
            );
            return { msg: constants.SUCCESS };
          }
          return { message: constants.INVALID_USER };
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
