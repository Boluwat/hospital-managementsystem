/* eslint-disable import/no-extraneous-dependencies */
const Joi = require('joi');
const namespace = require('hapijs-namespace');

const { employeeControllers } = require('../controllers');

module.exports = (server, prefix) => {
  namespace(server, prefix, [
    {
      method: 'Post',
      path: '/',
      config: {
        description: 'create an employee',
        tags: ['api', 'employee'],
        auth: 'simple',
        validate: {
          payload: Joi.object({
            email: Joi.string()
              .email()
              .required()
              .lowercase()
              .trim()
              .prefs({ convert: true }),
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            employementType: Joi.string().required(),
            role: Joi.string().min(24).max(24).required(),
            department: Joi.string().min(24).max(24).required(),
            mobile: Joi.string().required(),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: employeeControllers.create,
      },
    },
    {
      method: 'Post',
      path: '/employee-signIn',
      config: {
        description: 'employee login',
        tags: ['api', 'employee'],
        validate: {
          payload: Joi.object({
            email: Joi.string()
              .email()
              .required()
              .lowercase()
              .trim()
              .prefs({ convert: true }),
            password: Joi.string().required(),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: employeeControllers.empolyeeLogin,
      },
    },
    {
      method: 'Get',
      path: '/',
      config: {
        description: 'get all employee',
        tags: ['api', 'employee'],
        auth: 'simple',
        validate: {
          query: Joi.object({
            limit: Joi.number().description('max number  to be fetch'),
            offset: Joi.number().description('number of items to be skipped'),
            status: Joi.string().description('status of the employee'),
            employementType: Joi.string()
              .optional()
              .description('employement type'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: employeeControllers.getAll,
      },
    },
    {
      method: 'Get',
      path: '/{id}',
      config: {
        description: 'get  employee by id',
        tags: ['api', 'employee'],
        auth: 'simple',
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description('hospital id'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: employeeControllers.getEmployee,
      },
    },
    {
      method: 'Put',
      path: '/update/{id}',
      config: {
        description: 'update a hospital',
        tags: ['api', 'employee'],
        auth: 'simple',
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description('employee id'),
          }),
          payload: Joi.object({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            mobile: Joi.string().required(),
            employementType: Joi.string().required(),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: employeeControllers.update,
      },
    },
    {
      method: 'Delete',
      path: '/terminate/{id}',
      config: {
        description: 'terminate employee',
        tags: ['api', 'employee'],
        auth: 'simple',
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description('employee id'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: employeeControllers.deactivate,
      },
    },
    {
      method: 'Delete',
      path: '/suspend/{id}',
      config: {
        description: 'suspend an employee',
        tags: ['api', 'employee'],
        auth: 'simple',
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description('employee id'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: employeeControllers.suspendEmployee,
      },
    },
  ]);
};
