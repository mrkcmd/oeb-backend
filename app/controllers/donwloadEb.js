const fs = require("fs");
var config = require("../../config.json");
const request = require("request");
const { Storage } = require("@google-cloud/storage");
const path = require("path");

const gc = new Storage({
  keyFilename: config.ebook,
  projectId: "ebook-onlline",
});

exports.download = async (req, res) => {
  const directoryPath = __basedir + "/";
  const fileName = req.params.name;

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

exports.getListFiles = async (req, res) => {
  const directoryPath = __basedir + "/";
  const fileName = req.body.name;

  destFilename = path.join(directoryPath, fileName);
  const options = {
    destination: destFilename,
  };

  const download = await gc
    .bucket("ebook-online")
    .file(fileName)
    .download(options);

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let url = "https://pdx-ebook.herokuapp.com/api/files/" + fileName;

    res.status(200).send(url);
  });
};

exports.deleteFile = (req, res) => {
    const fileName  = req.body.name

    const path = __basedir + "/" + fileName

    fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return 
        }
    })
    res.status(200).send({
        message: "delete file "
    })

}

