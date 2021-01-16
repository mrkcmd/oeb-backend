const { Storage } = require("@google-cloud/storage");
var config = require("../../config.json");
const { account } = require("../models");
const db = require("../models");
const Ebook = db.ebook;
const Account = db.account;

const gc = new Storage({
  keyFilename: config.ebook,
  projectId: "ebook-onlline",
});

async function listFiles() {
  const [files] = await gc.bucket("ebook-online").getFiles();

  console.log("Files:");
  files.forEach((file) => {
    console.log(file.name);
  });
}

async function downloadFile(destFilename) {
  const options = {
    // The path to which the file should be downloaded, e.g. "./file.txt"
    destination: destFilename,
  };

  // Downloads the file
  await gc.bucket("ebook-online").file("/EbookPdf").download(options);

  console.log(
    `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
  );
}

// downloadFile().catch(console.error);
listFiles().catch(console.error);

exports.DownloadEbook = (req, res) => {
  const destFilename = req.params.name;
  console.log(destFilename);
//   const dw = downloadFile(destFilename).catch(console.error);

  const options = {
    // The path to which the file should be downloaded, e.g. "./file.txt"
    destination: destFilename,
  };
   gc.bucket("ebook-online").file("/EbookPdf").download(options).then((file) => {
       res.status(200).send({
           url : file
       })
   })
};

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
    Account.findAll().then((data) => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
}