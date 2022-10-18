const { roleService } = require("./roles");
const { hospitalService } = require("./hospital.service");
const { userService } = require("./user.service");
const { adminService } = require("./admin.service");
const { employeeService } = require("./employee.service");
const { patientService } = require("./patients");

module.exports = {
  roleService,
  hospitalService,
  userService,
  adminService,
  employeeService,
  patientService,
};
