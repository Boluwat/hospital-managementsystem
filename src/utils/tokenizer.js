/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('../lib/logger');

module.exports = {
  async sign(data) {
    return await jwt.sign(data, config.jwtSecret, { expiresIn: '24h' });
  },
  async verify(token) {
    try {
      return await jwt.verify(token, config.jwtSecret);
    } catch (err) {
      logger.log({
        level: 'error',
        message: err,
      });
    }
  },
  async confirmAdmin(request) {
    const { admin } = await jwt.verify(
      request.auth.credentials.token,
      config.jwtSecret,
    );
    return await request.server.app.services.admin.isAdmin(admin);
  },
  async confirmSuperAdmin(request) {
    const { admin } = await jwt.verify(
      request.auth.credentials.token,
      config.jwtSecret,
    );
    return await request.server.app.services.admin.isSuperAdmin(admin);
  },
  async confirmHospitalAdmin(request) {
    const { user, hospital } = await jwt.verify(
      request.auth.credentials.token,
      config.jwtSecret,
    );
    return await request.server.app.services.users.isAdmin(
      'hospital',
      user,
      hospital,
    );
  },
};
