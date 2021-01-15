const db = require("../models");
const config = require("../config/auth.config");
// const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const Token = db.token;

exports.generateUrl = (req, res) => {
  const token = uuidv4();
  Token.create({
    token: token,
  }).then((_token) => {
    res
      .send({
        token: _token.token,
      })
      .catch((error) => {
        res.status(500).send({ message: err.message });
      });
  });
};

exports.deleteUrl = (req, res) => {
  const token = req.body.token;
  Token.destroy({
    where: {
      token: token,
    },
  })
    .then((token) => {
      if (token == 1) {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with token=${token}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with token=" + token,
      });
    });
};
