const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Account = db.account;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.accountId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  Account.findByPk(req.accountId).then(account => {
    account.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};


const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
 
};
module.exports = authJwt;
