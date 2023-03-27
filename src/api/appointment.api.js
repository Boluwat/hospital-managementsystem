/* eslint-disable import/no-extraneous-dependencies */
const Joi = require('joi');
const namespace = require('hapijs-namespace');

const { appointmentControllers } = require('../controllers');

module.exports = (server, prefix) => {
  namespace(server, prefix, [
    {
      method: 'Post',
      path: '/book',
      config: {
        description: 'book an appointment',
        tags: ['api', 'booking'],
        auth: 'simple',
        validate: {
          payload: Joi.object({
            date: Joi.string().required(),
            doctor: Joi.string().max(24).min(24).optional(),
            departments: Joi.array().items(Joi.string().required()),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: appointmentControllers.create,
      },
    },
    {
      method: 'Get',
      path: '/{id}',
      config: {
        description: 'get an appointmentid',
        tags: ['api', 'booking'],
        auth: 'simple',
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description('appointment id'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: appointmentControllers.getAppointment,
      },
    },
    {
      method: 'Get',
      path: '/',
      config: {
        description: 'get all apppointment',
        tags: ['api', 'booking'],
        auth: 'simple',
        validate: {
          query: Joi.object({
            limit: Joi.number().description('max number  to be fetch'),
            offset: Joi.number().description('number of items to be skipped'),
            status: Joi.string().description('status of the employee'),
            date: Joi.string().optional(),
            hospital: Joi.string().max(24).min(24),
            departments: Joi.string().max(24).min(24),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: appointmentControllers.getAll,
      },
    },
    {
      method: 'Patch',
      path: '/{id}',
      config: {
        description: 'get an appointmentid',
        tags: ['api', 'booking'],
        auth: 'simple',
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description('appointment id'),
          }),
          payload: Joi.object({
            date: Joi.string().optional(),
            doctor: Joi.string().max(24).min(24).optional(),
            departments: Joi.array().items(Joi.string().optional()),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: appointmentControllers.update,
      },
    },
  ]);
};
