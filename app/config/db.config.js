var fs = require("fs");
var config = require("../../config.json");
module.exports = {
  // socketPath: "/cloudsql/ebook-onlline:asia-southeast1:ebookonline-sql",
  // HOST: "35.186.145.125",
  // USER: "root",
  // PASSWORD: "password",
  // DB: "db_oeb",
  // dialect: "mysql",
  HOST: "hwr4wkxs079mtb19.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  USER: "bwd3q500jenjevuo",
  PASSWORD: "uqpd0ooa3j7ey7jp",
  DB: "tzcpma8am0u5v62f",
  dialect: "mysql",
  // ssl: {
  //   ca: fs.readFileSync(config.ssl.ca),
  //   key: fs.readFileSync(config.ssl.key),
  //   cert: fs.readFileSync(config.ssl.cert),
  // },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

