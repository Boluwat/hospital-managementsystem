const config = require('config');
const mongoose = require('mongoose');
const logger = require('../lib/logger');

const initDB = async () => {
  try {
    const mongodbUrl = config.mongodb.url;
    mongoose.connect(mongodbUrl, { useNewUrlParser: true }).then(() => logger.log({
      level: 'info',
      message: 'connected to databse',
    }));
  } catch (error) {
    logger.log({
      level: 'error',
      message: error,
    });
  }
};

module.exports = { initDB };
