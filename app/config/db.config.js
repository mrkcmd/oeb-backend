var fs = require("fs");
var config = require("../../config.json");
module.exports = {
  // HOST: "35.186.145.125",
  // USER: "root",
  // PASSWORD: "",
  // DB: "db_oeb",
  // dialect: "mysql",
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "ebook2",
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
