const fs = require("fs");
var config = require("../../config.json");
const request = require("request");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const { PDFNet } = require("@pdftron/pdfnet-node");

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

  const { filename, watermark } = req.query;

  const inputPath = path.resolve(__basedir, "/ER.pdf");
  const outputPath = path.resolve(__basedir, "/ER_watermark.pdf");
  console.log(inputPath)
  console.log(outputPath)

  const watermarkPDF = async () => {
    const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
    await pdfdoc.iniSecurityHandle();

    const stamper = await PDFNet.Stamper.create(
      PDFNet.Stamper.SizeType.e_relative_scale,
      0.5,
      0.5
    );

    stamper.setAlignment(
      PDFNet.Stamper.HorizontalAlignment.e_horizontal_center,
      PDFNet.Stamper.VerticalAlignment.e_vertical_center
    );

    const redColorPt = await PDFNet.ColorPt.init(1, 0, 0);
    stamper.setFontColor(redColorPt);
    const ppSet = await PDFNet.PageSet.createRange(
      1,
      await pdfdoc.getPageCount()
    );

    await stamper.stampText(pdfdoc, "watermark", ppSet);
    await pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);



  };

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
  const fileName = req.body.name;

  const path = __basedir + "/" + fileName;

  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.status(200).send({
    message: "delete file ",
  });
};

exports.watermark = (req, res) => {};
