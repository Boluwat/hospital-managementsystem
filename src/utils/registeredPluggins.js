const authCookie = require('hapi-auth-cookie');
const authBearer = require('hapi-auth-bearer-token');
const bell = require('@hapi/bell');

module.exports = async(server) => {
    await server.register([
        bell,
        authBearer,
        authCookie,
    ]);
}