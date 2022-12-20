const roleControllers = require('./roles.contollers');
const hospitalControllers = require('./hospital.controllers');
const userControllers = require('./user.controller');
const adminControllers = require('./admin.controllers');
const patientControllers = require('./patient.controller');
const employeeControllers = require('./employee.controllers');
const appointmentControllers = require('./appointment.controller');


module.exports = {
    roleControllers,
    hospitalControllers,
    userControllers,
    adminControllers,
    patientControllers,
    employeeControllers,
    appointmentControllers
}