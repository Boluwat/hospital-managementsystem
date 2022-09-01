const {
    roleApi
} = require('../api');

module.exports = (server) => {
    roleApi(server, '/v1/role');
}