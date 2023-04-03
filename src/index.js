const logger = require('./lib/logger');
const { startServer } = require('./app');
const { initDB } = require('./utils/database');

async function setup() {
  try {
    await initDB();
    // eslint-disable-next-line global-require
    const { createServices } = require('./services/service-factory');
    const services = createServices();
    await startServer({
      services,
    });
  } catch (error) {
    logger.log({
      level: 'error',
      message: `failed to start server:::::${error}`,
    });
  }
}

setup();
