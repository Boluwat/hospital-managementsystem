/* eslint-disable import/no-extraneous-dependencies */
const Joi = require('joi');
const namespace = require('hapijs-namespace');
const config = require('config');
const { wardControllers } = require('../controllers');

function wardResponse() {
  return {
    _id: Joi.string().required().example('5fb55fd471da0f122d564e7a'),
    hospital: Joi.object({
      hospitalName: Joi.string().example('Sao Enterprise'),
      _id: Joi.string().required().example('5fb55fd471da0f122d564e7a'),
    }),
    patient: Joi.object({
      fullName: Joi.string().example('Thingy Thingy'),
      _id: Joi.string().required().example('5fb55fd471da0f122d564e7a'),
    }),
    availableStatus: Joi.boolean().example(false),
    name: Joi.string().example('folder name'),
    capacity: Joi.string().example(100),
    updatedAt: Joi.string().example('2020-11-18T17:54:28.209Z'),
    createdAt: Joi.string().example('2020-11-18T17:54:28.209Z'),
  };
}

module.exports = (server, prefix) => {
  namespace(server, prefix, [
    {
      method: 'Post',
      path: '/',
      config: {
        description: 'create a ward',
        tags: ['api', 'wards'],
        auth: 'simple',
        cors: config.cors,
        validate: {
          payload: Joi.object({
            name: Joi.string().required().example('Jeti'),
            capacity: Joi.number().required(),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: wardControllers.create,
        plugins: {
          'hapi-swagger': {
            id: 'create-ward',
            responses: {
              200: {
                description: 'Should return status 200',
                schema: Joi.object({
                  message: Joi.string().example('Success'),
                  wardId: Joi.string().required().example('5fb55fd471da0f122d564e7a'),
                }),
              },
            },
          },
        },
      },
    },
    {
      method: 'Get',
      path: '/',
      config: {
        description: 'get all wards',
        tags: ['api', 'wards'],
        auth: 'simple',
        validate: {
          query: Joi.object({
            limit: Joi.number().description('max number  to be fetch'),
            offset: Joi.number().description('number of items to be skipped'),
            roomStatus: Joi.boolean().description('status of the room'),
            name: Joi.string().optional(),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: wardControllers.getAll,
        plugins: {
          'hapi-swagger': {
            id: 'wards',
            responses: {
              200: {
                description: 'Should return status 200',
                schema: Joi.object({
                  totalCounts: Joi.number().required().example('15'),
                  count: Joi.number().required().example('15'),
                  wards: Joi.array().items(wardResponse()),
                }).label('ward'),
              },
            },
          },
        },
      },
    },
    {
      method: 'Get',
      path: '/{id}',
      config: {
        description: 'get a single ward',
        tags: ['api', 'wards'],
        auth: 'simple',
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description('id of the role'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: wardControllers.getWard,
        plugins: {
          'hapi-swagger': {
            id: 'ward',
            responses: {
              200: {
                description: 'Should return status 200',
                schema: Joi.object(wardResponse()).label('ward'),
              },
            },
          },
        },
      },
    },
    {
      method: 'Put',
      path: '/ward-rooms/{id}/admit-patient',
      config: {
        description: 'admit patient',
        tags: ['api', 'wards'],
        auth: 'simple',
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description('id of the ward room'),
          }),
          payload: Joi.object({
            patientId: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description('id of the patient'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: wardControllers.admitPatientWard,
        plugins: {
          'hapi-swagger': {
            id: 'admit-patient',
            responses: {
              200: {
                description: 'Should return status 200',
                schema: Joi.object(wardResponse()).label('ward'),
              },
            },
          },
        },
      },
    },
    {
      method: 'Put',
      path: '/ward-rooms/{id}/discharge-patient',
      config: {
        description: 'discharge patient',
        tags: ['api', 'wards'],
        auth: 'simple',
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description('id of the ward room'),
          }),
          payload: Joi.object({
            patientId: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description('id of the patient'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: wardControllers.dischargePatientWard,
        plugins: {
          'hapi-swagger': {
            id: 'discharge-patient',
            responses: {
              200: {
                description: 'Should return status 200',
                schema: Joi.object(wardResponse()).label('ward'),
              },
            },
          },
        },
      },
    },
    {
      method: 'Delete',
      path: '/ward/{id}',
      config: {
        description: 'delete a ward',
        tags: ['api', 'wards'],
        auth: 'simple',
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description('id of the role'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: wardControllers.deactivate,
        plugins: {
          'hapi-swagger': {
            id: 'delete-ward',
            responses: {
              200: {
                description: 'Should return status 200',
                schema: Joi.object({
                  message: Joi.string().example('Success'),
                }).label('ward'),
              },
            },
          },
        },
      },
    },
  ]);
};
