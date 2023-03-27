const { error } = require('../lib/error');
const constants = require('../utils/constant');
const { confirmHospitalAdmin, verify } = require('../utils/tokenizer');

const signUpPatient = async (request) => {
  const patient = request.payload;
  const { hospital } = await verify(request.auth.credentials.token);
  const response = await request.server.app.services.patients.signUpPatient(
    patient,
    hospital,
  );
  if (response.error) {
    return error(401, response.error);
  }
  return response;
};

const signInPatient = async (request, reply) => {
  const response = await request.server.app.services.patients.signInPatient(
    request.payload,
  );
  if (response.error) {
    if (response.error.activated === false) {
      return reply.response(response.error).code(403);
    }
    return error(401, response.error);
  }

  return response;
};

// function validateSignUpData(user) {
//   if (user.mobile.charAt(0) !== "+") {
//     return error(400, "Enter your your number with your country code");
//   }
//   return user;
// }

const activatePatient = async (request) => {
  const { patientId, token } = request.params;
  const response = await request.server.app.services.patients.activatePatient(
    patientId,
    token,
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const getAll = async (request) => {
  if (await confirmHospitalAdmin(request)) {
    const { query } = request;
    const { hospital } = await verify(request.auth.credentials.token);
    const patients = await request.server.app.services.patients.getAll(
      query,
      hospital,
    );
    const response = {
      count: patients.value ? patients.value.length : 0,
      patients: patients.value,
    };
    return response;
  }
  return error(403, 'Unauthorized');
};

const getPatientByHospital = async (request) => {
  const { id } = request.params;
  if (await confirmHospitalAdmin(request)) {
    const response = await request.server.app.services.patients.getPatientByID(
      id,
    );
    if (response.error) {
      return error(400, response.error);
    }
    return response;
  }
  return error(403, 'Unauthorized');
};

const getPatient = async (request) => {
  const { id } = request.params;
  const response = await request.server.app.services.patients.getPatientByID(
    id,
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const resetPassword = async (request) => {
  const { patient } = await verify(request.auth.credentials.token);
  const response = await request.server.app.services.patients.resetPassword(
    request.payload,
    patient,
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const updatePatient = async (request) => {
  const { patient } = await verify(request.auth.credentials.token);
  const { payload } = request;
  if (Object.keys(payload).length === 0 && payload.constructor === Object) {
    return error(400, constants.EMPTY_PAYLOAD);
  }
  const response = await request.server.app.services.patients.updatePatient(
    payload,
    patient,
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const deactivatePatient = async (request) => {
  if (await confirmHospitalAdmin(request)) {
    const { id } = request.params;
    const response = await request.server.app.services.patients.deletePatient(
      id,
    );
    if (response.error) {
      return error(400, response.error);
    }
    return response;
  }
  return error(403, 'Unauthorized');
};

module.exports = {
  getAll,
  resetPassword,
  signInPatient,
  signUpPatient,
  deactivatePatient,
  updatePatient,
  getPatientByHospital,
  activatePatient,
  getPatient,
};
