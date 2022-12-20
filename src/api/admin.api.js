// const Joi = require("joi");
// const namespace = require("hapijs-namespace");

// const { adminControllers } = require("../controllers");

// module.exports = (server, prefix) => {
//   namespace(server, prefix, [
//     {
//       method: "Post",
//       path: "/",
//       config: {
//         description: "create an admin",
//         tags: ["api", "admin"],
//         validate: {
//           payload: Joi.object({
//             email: Joi.string()
//               .email()
//               .required()
//               .lowercase()
//               .trim()
//               .prefs({ convert: true }),
//             firstname: Joi.string().required(),
//             lastname: Joi.string().required(),
//             password: Joi.string().required(),
//             hospitalName: Joi.string().required(),
//             role: Joi.string().required(),
//             mobile: Joi.string().required(),
//           }),
//           failAction: async (request, h, err) => {
//             throw err;
//           },
//         },
//         handler: adminControllers.createAdmin
//       },
//     },
//   ]);
// };
