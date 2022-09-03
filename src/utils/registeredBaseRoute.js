const { roleApi, hospitalApi, userApi } = require("../api");

module.exports = (server) => {
  roleApi(server, "/v1/role");
  hospitalApi(server, "/v1/hospital");
  userApi(server, "/v1/user");
};
