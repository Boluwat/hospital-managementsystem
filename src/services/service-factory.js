const {
    roleService,
    hospitalService,
    userService
} = require('.');


const createServices = () => ({
    roles: roleService(),
    hospitals: hospitalService(),
    users: userService(),
});

module.exports = {
    createServices
};