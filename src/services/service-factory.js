const {
  roleService,
  hospitalService,
  userService,
  adminService,
  employeeService,
  patientService
} = require(".");

const createServices = () => ({
  roles: roleService(),
  hospitals: hospitalService(),
  users: userService(),
  admin: adminService(),
  employees: employeeService(),
  patients: patientService(),
});

module.exports = {
  createServices,
};
