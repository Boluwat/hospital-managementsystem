const {
    roleService,
    hospitalService,
    userService,
    adminService
} = require('.');


const createServices = () => ({
    roles: roleService(),
    hospitals: hospitalService(),
    users: userService(),
    admin: adminService(),
});

module.exports = {
    createServices
};