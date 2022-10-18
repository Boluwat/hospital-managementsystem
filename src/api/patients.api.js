const Joi = require("joi");
const namespace = require("hapijs-namespace");

const { patientControllers } = require("../controllers");

module.exports = (server, prefix) => {
  namespace(server, prefix, [
    {
      method: "Post",
      path: "/login",
      config: {
        description: "sign in",
        tags: ["api", "patient"],
        validate: {
          payload: Joi.object({
            email: Joi.string()
              .required()
              .email()
              .trim()
              .prefs({ convert: true }),
            password: Joi.string().required(),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: patientControllers.signInPatient,
      },
    },
    {
      method: "Post",
      path: "/signUp",
      config: {
        description: "sign up",
        tags: ["api", "patient"],
        auth: "simple",
        validate: {
          payload: Joi.object({
            email: Joi.string()
              .required()
              .email()
              .trim()
              .prefs({ convert: true }),
            password: Joi.string().required(),
            fullname: Joi.string().required().example("boluwatife string"),
            address: Joi.string().required().example("boluwatife string"),
            gender: Joi.string().required().valid("Male", "Female"),
            mobile: Joi.string().required().example("+234...."),
            dob: Joi.string().optional().example("12/12/12"),
            state: Joi.string().required().example("Texas"),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: patientControllers.signUpPatient,
      },
    },
    {
      method: "Post",
      path: "/reset-password",
      config: {
        description: "reset patient password",
        tags: ["api", "patient"],
        auth: "simple",
        validate: {
          payload: Joi.object({
            newPassword: Joi.string()
              .required()
              .description("new patient password"),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: patientControllers.resetPassword,
      },
    },
    {
      method: "Get",
      path: "/activate/{patientId}/{token}",
      config: {
        description: "activate account",
        tags: ["api", "patient"],
        validate: {
          params: Joi.object({
            token: Joi.number().description("token"),
            patientId: Joi.string().max(24).min(24),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: patientControllers.activatePatient,
      },
    },
    {
      method: "Get",
      path: "/hospital/{id}",
      config: {
        description: "get patient by id",
        tags: ["api", "Patient"],
        auth: "simple",
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description("patient id"),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: patientControllers.getPatientByHospital,
      },
    },
    {
      method: "Get",
      path: "/{id}",
      config: {
        description: "get patient by id",
        tags: ["api", "Patient"],
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description("patient id"),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: patientControllers.getPatient,
      },
    },
    {
      method: "Get",
      path: "/",
      config: {
        description: "get all users",
        tags: ["api", "user"],
        auth: "simple",
        validate: {
          query: Joi.object({
            limit: Joi.number(),
            offset: Joi.number(),
            status: Joi.string().optional().valid("ACTIVE", "INACTIVE"),
            activated: Joi.boolean().optional(),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: patientControllers.getAll,
      },
    },
    {
      method: "Patch",
      path: "/hospital/patient",
      config: {
        description: "update a hospital patient",
        tags: ["api", "patient"],
        auth: "simple",
        validate: {
          payload: Joi.object({
            fullname: Joi.string().optional().example("boluwatife string"),
            address: Joi.string().optional().example("boluwatife string"),
            dob: Joi.string().optional().example("Jeti"),
            mobile: Joi.string().optional().example("Jeti"),
            state: Joi.string().optional().example("Texas"),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: patientControllers.updatePatient,
      },
    },
    {
      method: "Delete",
      path: "/{id}",
      config: {
        description: "delete a patient",
        tags: ["api", "patient"],
        auth: "simple",
        validate: {
          params: Joi.object({
            id: Joi.string()
              .required()
              .min(24)
              .max(24)
              .description("patient id"),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
        handler: patientControllers.deactivatePatient,
      },
    },
  ]);
};
