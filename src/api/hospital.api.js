const Joi = require("joi");
const namespace = require("hapijs-namespace");

const { hospitalControllers } = require("../controllers");

module.exports = (server, prefix) => {
  namespace(server, prefix, [
    {
      method: "Post",
      path: "/hospital",
      config: {
        description: "create a hospital",
        tags: ["api", "hospital"],
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
            password: Joi.string().required(),
            hospitalName: Joi.string().required(),
            mobile: Joi.string().required(),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: hospitalControllers.createHospital,
      },
    },
    {
      method: "Get",
      path: "/",
      config: {
        description: "get all hospitals",
        tags: ["api", "hospital"],
        auth: "simple",
        validate: {
          query: Joi.object({
            limit: Joi.number().description("max number  to be fetch"),
            offset: Joi.number().description("number of items to be skipped"),
            status: Joi.string().description("Active, inactive"),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: hospitalControllers.getAll,
      },
    },
    {
      method: "Get",
      path: "/{id}",
      config: {
        description: "get  hospital by id",
        tags: ["api", "hospital"],
        auth: "simple",
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description("hospital id"),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: hospitalControllers.getHospital,
      },
    },
    {
      method: "Patch",
      path: "/update",
      config: {
        description: "update a hospital",
        tags: ["api", "hospital"],
        auth: "simple",
        validate: {
          payload: Joi.object({
            state: Joi.string().optional().example("Jeti"),
            hospitalAddress: Joi.string().optional().example("Jeti"),
            instagramHandle: Joi.string().optional().example("Jeti"),
            facebookHandle: Joi.string().optional().example("Jeti"),
            twitterHandle: Joi.string().optional().example("Jeti"),
            website: Joi.string().optional().example("Jeti"),
            secondaryMobile: Joi.string().optional().example("Jeti"),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: hospitalControllers.updateHospital,
      },
    },
    {
      method: "Delete",
      path: "/",
      config: {
        description: "delete hospital",
        tags: ["api", "hospitals"],
        auth: "simple",
        validate: {
          payload: Joi.object({
            password: Joi.string().required(),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: hospitalControllers.deleteHospital,
      },
    },
  ]);
};
