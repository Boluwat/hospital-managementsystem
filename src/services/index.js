const { roleService } = require('./roles');
const { hospitalService } = require('./hospital.service');
const { userService } = require('./user.service');
const { adminService } = require('./admin.service');
const { employeeService } = require('./employee.service');
const { patientService } = require('./patients');
const { appointmentService } = require('./appointment.service');
const { wardService } = require('./ward.service');

module.exports = {
  roleService,
  hospitalService,
  userService,
  adminService,
  employeeService,
  patientService,
  appointmentService,
  wardService,
};
