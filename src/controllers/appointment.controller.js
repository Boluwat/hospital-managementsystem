const { error } = require('../lib/error');
const constants = require('../utils/constant');
const { verify, confirmHospitalAdmin } = require('../utils/tokenizer');

const create = async (request) => {
  const booking = request.payload;
  const { patient } = await verify(request.auth.credentials.token);
  const response = await request.server.app.services.appointments.create(
    booking,
    patient,
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const getAppointment = async (request) => {
  const { id } = request.params;
  const { patient } = await verify(request.auth.credentials.token);
  const response = await request.server.app.services.appointments.getById(
    id,
    patient,
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const getAll = async (request) => {
  if (!(await confirmHospitalAdmin(request))) {
    return error(403, 'Unauthorized');
  }
  const { query } = request;
  const { patient } = await verify(request.auth.credentials.token);
  const booking = await request.server.app.services.appointments.getAll(
    query,
    patient,
  );
  const response = {
    count: booking.value ? booking.value.length : 0,
    appointments: booking.value,
  };
  if (response.error) {
    return error(404, response.error);
  }
  return response;
};

const update = async (request) => {
  const { id } = request.params;
  const { payload } = request;
  if (Object.keys(payload).length === 0 && payload.constructor === Object) {
    return error(400, constants.EMPTY_PAYLOAD);
  }
  const response = await request.server.app.services.appointments.update(
    id,
    payload,
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

module.exports = {
  create,
  getAppointment,
  getAll,
  update,
};
