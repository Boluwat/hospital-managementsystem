const { roleService } = require('./roles');
const { hospitalService } = require('./hospital.service');
const { userService } = require('./user.service');
const {adminService}= require('./admin.service')

module.exports = {
    roleService,
    hospitalService,
    userService,
    adminService
}