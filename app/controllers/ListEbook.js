const { Storage } = require("@google-cloud/storage");
var config = require("../../config.json");
const { account } = require("../models");
const db = require("../models");
const Ebook = db.ebook;
const Account = db.account;

const path = require("path");


const gc = new Storage({
  keyFilename: config.ebook,
  projectId: "ebook-onlline",
});

exports.listFiles = async (req, res) => {
  const [files] = await gc.bucket("ebook-online").getFiles();
  var listData = [];
  files.forEach((file) => {
    listData.push(file.name);
  });
  res.send({
    listData,
  });
};


exports.AddEbook = (req, res) => {
  Account.findOne({
    where: {
      id: req.body.account.id,
    },
  })
    .then((account) => {
      console.log(account);
      Ebook.create({
        name: req.body.name,
        purchased: require("moment")().add(7,'hours').format("DD-MM-YYYY HH:mm:ss"),
        //   ip: req.body.ip,
        //   download: require("moment")().format("DD-MM-YYYY HH:mm:ss"),
        accountId: account.id,
      });
      res.status(200).send({
        firstname: account.firstname,
        name: req.body.name,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.AccountFindAll = (req, res) => {
  Account.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.AccountFindEbook = (req, res) => {
  Ebook.findAll({
    where: {
      accountId: req.body.account.id
    }
  }).then((data) => {
    res.status(200).send(data)
  }).catch((err) => {
    res.status(500).send({
      message: err.message
    })
  })
};
