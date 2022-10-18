const roleControllers = require('./roles.contollers');
const hospitalControllers = require('./hospital.controllers');
const userControllers = require('./user.controller');
const adminControllers = require('./admin.controllers');
const patientControllers = require('./patient.controller');


module.exports = {
    roleControllers,
    hospitalControllers,
    userControllers,
    adminControllers,
    patientControllers
}