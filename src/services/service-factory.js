const {
  roleService,
  hospitalService,
  userService,
  adminService,
  employeeService,
  patientService,
  appointmentService,
  wardService,
} = require('.');

const createServices = () => ({
  roles: roleService(),
  hospitals: hospitalService(),
  users: userService(),
  admin: adminService(),
  employees: employeeService(),
  patients: patientService(),
  appointments: appointmentService(),
  wards: wardService(),
});

module.exports = {
  createServices,
};
