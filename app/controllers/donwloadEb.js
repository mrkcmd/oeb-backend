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
  const directoryPath = __basedir + "/resources/static/assets/download/";
  const fileName = req.body.name;

  destFilename = path.join(directoryPath, fileName);
  const options = {
    destination: destFilename,
  };

  const download = await gc
    .bucket("ebook-online")
    .file(fileName)
    .download(options);

    

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};
