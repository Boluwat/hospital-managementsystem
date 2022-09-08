const {
  roleService,
  hospitalService,
  userService,
  adminService,
  employeeService,
} = require(".");

const createServices = () => ({
  roles: roleService(),
  hospitals: hospitalService(),
  users: userService(),
  admin: adminService(),
  employees: employeeService(),
});

module.exports = {
  createServices,
};
