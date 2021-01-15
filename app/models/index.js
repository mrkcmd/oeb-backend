const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD,{
  host: config.HOST,
  dialect: config.dialect,
  define: {
    timestamps: false,
  },
  dialectOptions: {
    ssl: {
      key: config.ssl.key,
      cert: config.ssl.cert,
      ca: config.ssl.ca,
    },
  },
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.account = require("./Account.js")(sequelize, Sequelize);
db.role = require("./Role.js")(sequelize, Sequelize);
db.ebook = require("./Ebook")(sequelize, Sequelize);
db.log = require("./LogAction")(sequelize, Sequelize);

db.account.hasMany(db.ebook,{
  as: "ebook",
} );

db.ebook.belongsTo(db.account, {
  foreignKey: "accountId",
  as: "account",
});

db.role.belongsToMany(db.account, {
  through: "account_roles",
  foreignKey: "roleId",
  otherKey: "accountId",
});
db.account.belongsToMany(db.role, {
  through: "account_roles",
  foreignKey: "accountId",
  otherKey: "roleId",
});

db.account.hasMany(db.log,{
  as: "logs",
} );

db.log.belongsTo(db.account, {
  foreignKey: "accountId",
  as: "account",
});



db.ROLES = ["user", "admin"];

module.exports = db;
