// const { error } = require("../lib/error");
// const constants = require("../utils/constant");
// const {
//   confirmAdmin,
//   verify,
//   confirmHospitalAdmin,
//   confirmSuperAdmin,
// } = require("../utils/tokenizer");
// const config = require("config");

// const createAdmin = async (request) => {
//   if (await confirmSuperAdmin(request)) {
//     const { email, firstname, lastname, hospitalName, password, mobile, role } =
//       request.payload;
//     if (role === config.migrationIDS.ADMIN_ROLE_IDS[0]) {
//       return error(400, "unable to create Admin user");
//     }
//     const adminResponse = await request.server.app.services.admin.signupAdmin({
//       email,
//       firstname,
//       lastname,
//       password,
//       mobile,
//       isHospitalMgt: true,
//       role: config.migrationIDS.HOSPITAL_ADMIN_ID,
//     });
//     if (adminResponse.error) {
//       return error(400, adminResponse.error);
//     }
//     return adminResponse;
//   }
//   return 403, "unathourized";
// };

// module.exports = {
//     createAdmin
// }
