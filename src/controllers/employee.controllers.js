const { error } = require("../lib/error");
const constants = require("../utils/constant");
const { confirmHospitalAdmin, verify } = require("../utils/tokenizer");

const create = async (request) => {
  const { payload } = request;
  if (!(await confirmHospitalAdmin(request))) {
    return error(403, "Unauthorized");
  }
  const { hospital, user } = await verify(request.auth.credentials.token);
  const response = await request.server.app.services.employees.create(
    payload,
    hospital,
    user
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const getAll = async (request) => {
  if (!(await confirmHospitalAdmin(request))) {
    return error(403, "Unauthorized");
  }
  const { query } = request;
  // const { hospital } = await verify(request.auth.credentials.token);
  const employee = await request.server.app.services.employees.getAll(
    query /*hospital*/
  );
  const response = {
    count: employee.value ? employee.value.length : 0,
    employees: employee.value,
  };
  if (response.error) {
    return error(404, response.error);
  }
  return response;
};

const getEmployee = async (request) => {
  if (!(await confirmHospitalAdmin(request))) {
    return error(403, "Unauthorized");
  }
  const { id } = request.params;
  const { hospital } = await verify(request.auth.credentials.token);
  const response = await request.server.app.services.employees.getById(
    id,
    hospital
  );
  if (response.error) {
    return error(404, response.error);
  }
  return response;
};

const update = async (request) => {
  if (!(await confirmHospitalAdmin(request))) {
    return error(403, "Unauthorized");
  }
  const { id } = request.params;
  const { payload } = request;
  // const { hospital } = await verify(request.auth.credentials.token);
  if (Object.keys(payload).length === 0 && payload.constructor === Object) {
    return error(400, constants.EMPTY_PAYLOAD);
  }
  const response = await request.server.app.services.employees.update(
    id,
    payload,
    // hospital
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const deactivate = async (request) => {
  if (!(await confirmHospitalAdmin(request))) {
    return error(403, "Unauthorized");
  }
  const { id } = request.params;
  const { hospital } = await verify(request.auth.credentials.token);
  const response = await request.server.app.services.employees.deactivate(
    id,
    hospital
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

module.exports = {
  create,
  getAll,
  update,
  getEmployee,
  deactivate,
};
