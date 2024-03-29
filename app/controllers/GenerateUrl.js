const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const Token = db.token;

async function deleteToken(token) {
  await Token.destroy({
    where: {
      token: token,
    },
  });
}

exports.generateUrl = (req, res) => {
  const token = uuidv4();

  Token.create({
    token: token,
  }).then((_token) => {
    
    setTimeout(() => deleteToken(token), 1000*60*15);
    res.send({
        token: token,
      })
  }).catch((err) => {
    res.status(500).send({message: err.message})
  })
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
          message: `Cannot delete not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with token=" + token,
      });
    });
};
