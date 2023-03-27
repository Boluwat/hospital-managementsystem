const {
  roleApi,
  hospitalApi,
  userApi,
  patientApi,
  employeeApi,
  appointmentApi,
} = require('../api');

module.exports = (server) => {
  roleApi(server, '/v1/role');
  hospitalApi(server, '/v1/hospital');
  userApi(server, '/v1/user');
  patientApi(server, '/v1/patient');
  employeeApi(server, '/v1/employee');
  appointmentApi(server, '/v1/booking');
};
