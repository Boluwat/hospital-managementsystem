const { error } = require('../lib/error');
const constants = require('../utils/constant');
const { confirmHospitalAdmin, confirmAdmin } = require('../utils/tokenizer');

const create = async (request) => {
  const role = request.payload;
  const response = await request.server.app.services.roles.create(role);
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const getAll = async (request) => {
  const { offSet, limit, status } = request.query;
  const result = await request.server.app.services.roles.getAll({
    offSet,
    limit,
    status,
  });
  const response = {
    count: result.value ? result.value.length : 0,
    totalCounts: result.totalCounts,
    roles: result.value,
  };
  return response;
};

const getRole = async (request) => {
  const { id } = request.params;
  const value = await request.server.app.services.roles.getById(id);
  if (value.error) {
    return error(404, value.error);
  }
  return value;
};

const update = async (request) => {
  if (await confirmHospitalAdmin(request)) {
    const role = request.payload;
    const { id } = request.params;
    if (Object.keys(role).length === 0 && role.constructor === Object) {
      return error(400, constants.EMPTY_PAYLOAD);
    }
    const response = await request.server.app.services.roles.update(role, id);
    if (response.error) {
      return error(400, response.error);
    }
    return response;
  }
  return error(403, 'Unauthorized');
};

const deactivate = async (request) => {
  if (await confirmAdmin(request)) {
    const { id } = request.params;
    const response = await request.server.app.services.roles.deactivate(id);
    if (response.error) {
      return error(400, response.error);
    }
    return response;
  }
  return error(403, 'Unauthorized');
};

module.exports = {
  deactivate,
  update,
  getRole,
  create,
  getAll,
};
