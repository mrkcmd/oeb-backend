const { Storage } = require("@google-cloud/storage");
var config = require("../../config.json");
const { account } = require("../models");
const db = require("../models");
const Ebook = db.ebook;
const Account = db.account;

const path = require("path");
const cwd = path.join("D:/");

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

exports.downloadFile = async (req, res) => {
  destFilename = path.join(cwd, "IMG_0009.JPG");
  const options = {
    // The path to which the file should be downloaded, e.g. "./file.txt"
    destination: destFilename,
    
  };

  // Downloads the file
  const download = await gc
    .bucket("ebook-online")
    .file("IMG_0009.JPG")
    .download(options);
  console.log("dw", options);
  console.log(
    `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
  );
};

// downloadFile().catch(console.error);

exports.AddEbook = (req, res) => {
  Account.findOne({
    where: {
      id: req.param.id,
    },
  })
    .then((account) => {
      console.log(account);
      Ebook.create({
        name: req.body.name,
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
