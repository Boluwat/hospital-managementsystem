const { error } = require("../lib/error");
const constants = require("../utils/constant");
const { confirmAdmin, verify } = require("../utils/tokenizer");
const config = require("config");

const createHospital = async (request) => {
  const { email, firstname, lastname, hospitalName, password, mobile } =
    request.payload;

  const userResponse = await request.server.app.services.users.signUpUser({
    email,
    firstname,
    lastname,
    password,
    mobile,
    isHospitalMgt: true,
    role: config.migrationIDS.HOSPITAL_ADMIN_ID,
  });

  if (userResponse.error) {
    return error(400, userResponse.error);
  }

  const hospitalResponse =
    await request.server.app.services.hospitals.signupHospital({
      email,
      hospitalName,
      mobile,
      users: [await userResponse.userId],
    });

  if (hospitalResponse.error) {
    return error(400, hospitalResponse.error);
  }
  return userResponse;
};

const getAll = async (request) => {
  if (await confirmAdmin(request)) {
    const { query } = request;
    const hospital = await request.server.app.services.hospitals.getAll(query);
    const response = {
      count: hospital.value ? hospital.value.length : 0,
      totalCounts: hospital.totalCounts,
      hospitals: hospital.value,
    };
    return response;
  }
  return error(403, "Unauthorized");
};

const getHospital = async (request) => {
  const { id } = request.params;
  const { hospital } = await verify(request.auth.credentials.token);
  if ((await confirmAdmin(request)) || hospital) {
    const value = await request.server.app.services.hospitals.getHospitalById(
      id
    );
    if (value.error) {
      return error(400, value.error);
    }
    return value;
  }
  return error(403, "Unauthorized");
};

// const getHopitalBy Admin
// const getHopitalByUsers using the getHopital

const updateHospital = async (request) => {
  if (await confirmAdmin(request)) {
    const { payload } = request;
    if (Object.keys(payload).length === 0 && payload.constructor === Object) {
      return error(400, constants.EMPTY_PAYLOAD);
    }
    const { hospital } = await verify(request.auth.credentials.token);
    const response = await request.server.app.services.hospitals.updateHospital(
      payload,
      hospital
    );
    if (response.error) {
      return error(400, response.error);
    }
    return response;
  }
  return error(403, "Unauthorized");
};

const deleteHospital = async (request) => {
  const { hospital } = await verify(request.auth.credentials.token);
  const { password } = request.payload;
  const response =
    await request.server.app.services.hospitals.deactivateAccount(
      hospital,
      password
    );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

module.exports = {
  deleteHospital,
  updateHospital,
  getAll,
  getHospital,
  createHospital,
};
