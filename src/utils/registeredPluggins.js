/* eslint-disable import/no-extraneous-dependencies */
const authCookie = require('hapi-auth-cookie');
const authBearer = require('hapi-auth-bearer-token');
const bell = require('@hapi/bell');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const config = require('config');
const appPackage = require('../package.json');

module.exports = async (server) => {
  await server.register([
    bell,
    authBearer,
    Inert,
    Vision,
    authCookie,
    {
      plugin: HapiSwagger,
      options: {
        host: process.env.SWAGGER_HOST || config.swagger.host,
        documentationPage: config.environment !== 'production',
        info: {
          title: `${appPackage.name} Documentation`,
          version: appPackage.version,
        },
        basePath: '/v1/',
        grouping: 'tags',
        schemes: ['https', 'http'],
      },
    },
  ]);
};
