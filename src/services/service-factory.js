const {
  roleService,
  hospitalService,
  userService,
  adminService,
  employeeService,
  patientService,
  appointmentService,
} = require('.');

const createServices = () => ({
  roles: roleService(),
  hospitals: hospitalService(),
  users: userService(),
  admin: adminService(),
  employees: employeeService(),
  patients: patientService(),
  appointments: appointmentService(),
});

module.exports = {
  createServices,
};
