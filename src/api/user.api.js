/* eslint-disable import/no-extraneous-dependencies */
const Joi = require('joi');
const namespace = require('hapijs-namespace');

const { userControllers } = require('../controllers');

module.exports = (server, prefix) => {
  namespace(server, prefix, [
    {
      method: 'Post',
      path: '/login',
      config: {
        description: 'sign in',
        tags: ['api', 'user'],
        validate: {
          payload: Joi.object({
            userEmailMobile: Joi.string()
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
        handler: userControllers.signInCustomUser,
      },
    },
    // {
    //   method: "Post",
    //   path: "/hospital/employee",
    //   config: {
    //     description: "create an hospital employee",
    //     tags: ["api", "user"],
    //     auth: "simple",
    //     validate: {
    //       payload: Joi.object({
    //         email: Joi.string()
    //           .email()
    //           .required()
    //           .lowercase()
    //           .trim()
    //           .prefs({ convert: true }),
    //         role: Joi.string()
    //           .required()
    //           .max(24)
    //           .min(24)
    //           .description("user role"),
    //         firstname: Joi.string().required(),
    //         lastname: Joi.string().required(),
    //         gender: Joi.string().optional().valid("MALE", "FEMALE"),
    //         mobile: Joi.string().required(),
    //       }),
    //       failAction: async (request, h, err) => {
    //         throw err;
    //       },
    //     },
    //     handler: userControllers.createHospitalUser,
    //   },
    // },
    {
      method: 'Post',
      path: '/reset-password',
      config: {
        description: 'reset user password',
        tags: ['api', 'user'],
        auth: 'simple',
        validate: {
          payload: Joi.object({
            newPassword: Joi.string()
              .required()
              .description('new user password'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: userControllers.resetPassword,
      },
    },
    {
      method: 'Get',
      path: '/activate/{userId}/{token}/user',
      config: {
        description: 'activate account',
        tags: ['api', 'user'],
        validate: {
          params: Joi.object({
            token: Joi.number().description('token'),
            userId: Joi.string().max(24).min(24),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: userControllers.activateUser,
      },
    },
    {
      method: 'Get',
      path: '/{id}',
      config: {
        description: 'get user by id',
        tags: ['api', 'user'],
        auth: 'simple',
        validate: {
          params: Joi.object({
            id: Joi.string().required().min(24).max(24)
              .description('user id'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: userControllers.getUser,
      },
    },
    {
      method: 'Get',
      path: '/',
      config: {
        description: 'get all users',
        tags: ['api', 'user'],
        auth: 'simple',
        validate: {
          query: Joi.object({
            limit: Joi.number(),
            offset: Joi.number(),
            status: Joi.string().optional().valid('ACTIVE', 'INACTIVE'),
            activated: Joi.boolean().optional(),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: userControllers.getAll,
      },
    },
    {
      method: 'Patch',
      path: '/hospital/user',
      config: {
        description: 'update a hospital user',
        tags: ['api', 'user'],
        auth: 'simple',
        validate: {
          payload: Joi.object({
            gender: Joi.string().optional().example('Jeti'),
            dob: Joi.string().optional().example('Jeti'),
            mobile: Joi.string().optional().example('Jeti'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: userControllers.updateUser,
      },
    },
    {
      method: 'Delete',
      path: '/user',
      config: {
        description: 'delete a user',
        tags: ['api', 'user'],
        auth: 'simple',
        validate: {
          payload: Joi.object({
            password: Joi.string().required(),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: userControllers.deactivateUser,
      },
    },
  ]);
};
