const db = require("../models");
const config = require("../config/auth.config");
const Account = db.account;
const Role = db.role;
const Log = db.log;
const Op = db.Sequelize.Op;
const Token = db.token;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { request } = require("express");

exports.signup = (req, res) => {
  Token.findOne({
    where: {
      token: req.body.token,
    },
  })
    .then((token) => {
      if (token != null) {
        Account.create({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
        })
          .then((account) => {
            if (req.body.roles) {
              Role.findAll({
                where: {
                  name: {
                    [Op.or]: req.body.roles,
                  },
                },
              }).then((roles) => {
                account.setRoles(roles).then(() => {
                  res
                    .status(200)
                    .send({ message: "User registered successfully!" });
                });
              });
            } else {
              // user role = 1
              account.setRoles([1]).then(() => {
                res
                  .status(200)
                  .send({ message: "User registered successfully!" });
              });
            }
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      } else {
        res.status(404).send({ message: "Token Not Found" });
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "Token Not Found" });
    });
  // Save User to Database
};

exports.signin = (req, res) => {
  Account.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        Log.create({
          msg: "Login",
          date: require("moment")()
            .add(7, "hours")
            .format("DD-MM-YYYY HH:mm:ss"),
          accountId: user.id,
        });

        res.status(200).send({
          id: user.id,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.logOut = (req, res) => {
 

  Account.findOne({
    where: {
      id: req.body.id,
    },
  }).then((user) => {
    Log.create({
      msg: "Logout",
      date: require("moment")().add(7, "hours").format("DD-MM-YYYY HH:mm:ss"),
      accountId: user.id,
    });

    res.status(200).send({
      id: user.id,
      email: user.email,
    });
  });
};

exports.AutoLogOut = (req, res) => {
 
  Account.findOne({
    where: {
      id: req.body.id,
    },
  }).then((user) => {
    Log.create({
      msg: "Logout Auto",
      date: require("moment")().add(7, "hours").format("DD-MM-YYYY HH:mm:ss"),
      accountId: user.id,
    });

    res.status(200).send({
      id: user.id,
      email: user.email,
    });
  });
};
