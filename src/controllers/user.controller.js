const { error } = require("../lib/error");
const constants = require("../utils/constant");
const {
  confirmAdmin,
  verify,
  confirmHospitalAdmin,
} = require("../utils/tokenizer");
const config = require("config");

const signInCustomUser = async (request, reply) => {
  const response = await request.server.app.services.users.signInUser(
    request.payload
  );
  if (response.error) {
    if (response.error.activated === false) {
      return reply.response(response.error).code(403);
    }
    return error(401, response.error);
  }

  return response;
};

function validateSignUpData(user) {
  if (user.mobile.charAt(0) !== "+") {
    return error(400, "Enter your your number with your country code");
  }
  return user;
}

const createUser = async (request, type) => {
  const user = request.payload;
  if (
    (type === constants.HOSPITALS && !(await confirmHospitalAdmin(request))) ||
    (type === constants.HOSPITALS &&
      user.role !== config.migrationIDS.HOSPITAL_ADMIN_ID &&
      user.role !== config.migrationIDS.HOSPITAL_USER_ID)
  ) {
    return error(403, "unathorized");
  }
  if (type === "Admin" && !(await confirmAdmin(request))) {
    return error(403, "unathorized");
  }
  const validateData = validateSignUpData(user);
  if (validateData.error) return validateData.error;
  const query = {};
  const { hospital } = await verify(request.auth.credentials.token);
  
  if (hospital) {
    query.hospital = hospital;
    validateData.hospital = hospital;
  }

  const response = await request.server.app.services.users.signUpUser(
    validateData
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const createHospitalUser = async (request) =>
  await createUser(request, constants.HOSPITALS);

const createAdminUser = async (request) => await createUser(request, "Admin");

const activateUser = async (request) => {
  const { userId, token } = request.params;
  const response = await request.server.app.services.users.activateUser(
    userId,
    token
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const getAll = async (request) => {
  if (await confirmAdmin(request)) {
    const { query } = request;
    const users = await request.server.app.services.users.getAll(query);
    const response = {
      count: users.value ? users.value.length : 0,
      users: users.value,
    };
    return response;
  }
  return error(403, "Unauthorized");
};

const getUser = async (request) => {
  const { id } = request.params;
  const { user } = await verify(request.auth.credentials.token);
  if ((await confirmAdmin(request)) || id === user) {
    const response = await request.server.app.services.users.getUserByID(id);
    if (response.error) {
      return error(400, response.error);
    }
    return response;
  }
  return error(403, "Unauthorized");
};

const resetPassword = async (request) => {
  const { user } = await verify(request.auth.credentials.token);
  const response = await request.server.app.services.users.resetPassword(
    request.payload,
    user
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const updateUser = async (request) => {
  const { payload } = request;
  if (Object.keys(payload).length === 0 && payload.constructor === Object) {
    return error(400, constants.EMPTY_PAYLOAD);
  }
  const { user } = await verify(request.auth.credentials.token);
  const response = await request.server.app.services.users.updateUser(
    payload,
    user
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

const deactivateUser = async (request) => {
  const { password } = request.payload;
  const { user } = await verify(request.auth.credentials.token);
  const response = await request.server.app.services.users.deleteUser(
    password,
    user
  );
  if (response.error) {
    return error(400, response.error);
  }
  return response;
};

module.exports = {
  getAll,
  activateUser,
  deactivateUser,
  getUser,
  resetPassword,
  createAdminUser,
  createHospitalUser,
  updateUser,
  signInCustomUser,
};
