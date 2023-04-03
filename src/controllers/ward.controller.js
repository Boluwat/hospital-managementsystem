const { error } = require('../lib/error');
// const constants = require('../utils/constant');
const { confirmHospitalAdmin, verify } = require('../utils/tokenizer');

const create = async (request) => {
  const { payload } = request;
  if (!(confirmHospitalAdmin(request))) {
    return error(401, 'Unauthorized');
  }
  const { hospital } = await verify(request.auth.credentials.token);
  const response = await request.server.app.services.wards.create(
    payload,
    hospital,
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const admitPatientWard = async (request) => {
  if (!(confirmHospitalAdmin(request))) {
    return error(403, 'Unauthorized');
  }
  const { id } = request.params;
  const { patientId } = request.payload;
  const response = await request.server.app.services.wards.admitPatient(
    id,
    patientId,
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const dischargePatientWard = async (request) => {
  if (!(confirmHospitalAdmin(request))) {
    return error(403, 'Unauthorized');
  }
  const { id } = request.params;
  const { patientId } = request.payload;
  const response = await request.server.app.services.wards.dischargePatient(
    id,
    patientId,
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
    const patients = await request.server.app.services.wards.getAll(
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

const getWard = async (request) => {
  if (!(confirmHospitalAdmin(request))) {
    return error(403, 'Unauthorized');
  }
  const { id } = request.params;
  const response = await request.server.app.services.wards.getWard(
    id,
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const deactivate = async (request) => {
  if (await confirmHospitalAdmin(request)) {
    const { id } = request.params;
    const response = await request.server.app.services.wards.deactivate(
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
  admitPatientWard,
  create,
  deactivate,
  getWard,
  dischargePatientWard,
};
