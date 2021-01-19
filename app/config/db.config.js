var fs = require("fs");
var config = require("../../config.json");
module.exports = {
  // socketPath: "/cloudsql/ebook-onlline:asia-southeast1:ebookonline-sql",
  // HOST: "35.186.145.125",
  // USER: "root",
  // PASSWORD: "password",
  // DB: "db_oeb",
  // dialect: "mysql",
  HOST: "us-cdbr-east-03.cleardb.com",
  USER: "b5846fb109c2ce",
  PASSWORD: "79d493b8",
  DB: "heroku_73c03d4ea91dec3",
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

