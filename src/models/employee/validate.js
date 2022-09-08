const mongoose = require("mongoose");

async function validateEmployee(val) {
  const Employee = mongoose.model("Employee");
  try {
    const employee = await Employee.findById(val).lean().exec();
    return Boolean(employee);
  } catch (ex) {
    return false;
  }
}

module.exports = {
  validateEmployee,
};
