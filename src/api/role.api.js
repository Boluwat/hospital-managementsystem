const Joi = require("joi");
const namespace = require("hapijs-namespace");
const { roleControllers } = require("../controllers");

module.exports = (server, prefix) => {
  namespace(server, prefix, [
    {
      method: "Post",
      path: "/",
      config: {
        description: "create a role",
        tags: ["api", "roles"],
        validate: {
          payload: Joi.object({
            name: Joi.string().required().example("Jeti"),
            description: Joi.string().required().example("Jeti"),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: roleControllers.create,
      },
    },
    {
      method: "Get",
      path: "/",
      config: {
        description: "get all role",
        tags: ["api", "roles"],
        auth: "simple",
        validate: {
          query: Joi.object({
            limit: Joi.number().description("max number  to be fetch"),
            offset: Joi.number().description("number of items to be skipped"),
            status: Joi.boolean().description("status of the role"),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: roleControllers.getAll,
      },
    },
    {
      method: "Get",
      path: "/role/{id}",
      config: {
        description: "get a single role",
        tags: ["api", "roles"],
        auth: "simple",
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description("id of the role"),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: roleControllers.getRole,
      },
    },
    {
      method: "Put",
      path: "/role/{id}",
      config: {
        description: "update a role",
        tags: ["api", "roles"],
        auth: "simple",
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description("id of the role"),
          }),
          payload: Joi.object({
            name: Joi.string().optional().example("Jeti"),
            description: Joi.string().optional().example("Jeti"),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: roleControllers.update,
      },
    },
    {
        method: "Delete",
        path: "/role/{id}",
        config: {
          description: "delete a role",
          tags: ["api", "roles"],
          auth: "simple",
          validate: {
            params: Joi.object({
              id: Joi.string()
                .required()
                .min(24)
                .max(24)
                .description("id of the role"),
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
          handler: roleControllers.deactivate,
        },
      },
  ]);
};
