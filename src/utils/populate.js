const config = require("config");
const { Department } = require("../models/department");
const department = require("./department.json");
const { initDB } = require("./database");
const logger = require("../lib/logger");




const start = async () => {
  try {
    await initDB(config.mongodb.url);
    await Department.deleteMany();
    await Department.create(department);
    console.log("success");
    process.exit(0);
  } catch (error) {
    logger.log({
      level: "error",
      message: error,
    });
  }
};

start();
