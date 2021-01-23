const fs = require("fs");
var config = require("../../config.json");
const request = require("request");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const { PDFNet } = require("@pdftron/pdfnet-node");
const mimeType = require('mimeType');


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

exports.watermark = (req, res) => {
  const filename = req.params.filename;
  const watermark = req.params.watermark;
  let ext = path.parse(filename).ext;

  if (ext !== ".pdf") {
    res.statusCode = 500;
    res.end(`File is not a PDF. Please convert it first.`);
  }
  const inputPath = path.resolve(__dirname, filename);
  const outputPath = path.resolve(
    __dirname,
  
    `${filename}_watermarked.pdf`
  );
  const main = async () => {
    const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
    await pdfdoc.initSecurityHandler();

    const stamper = await PDFNet.Stamper.create(
      PDFNet.Stamper.SizeType.e_relative_scale,
      0.5,
      0.5
    ); // Stamp size is relative to the size of the crop box of the destination page
    stamper.setAlignment(
      PDFNet.Stamper.HorizontalAlignment.e_horizontal_center,
      PDFNet.Stamper.VerticalAlignment.e_vertical_center
    );
    const redColorPt = await PDFNet.ColorPt.init(1, 0, 0);
    stamper.setFontColor(redColorPt);
    const pgSet = await PDFNet.PageSet.createRange(
      1,
      await pdfdoc.getPageCount()
    );
    stamper.stampText(pdfdoc, watermark, pgSet);

    pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
  };

  PDFNetEndpoint(main, outputPath, res);
};

const PDFNetEndpoint = (main, pathname, res) => {
  PDFNet.runWithCleanup(main) // you can add the key to PDFNet.runWithCleanup(main, process.env.PDFTRONKEY)
    .then(() => {
      PDFNet.shutdown();
      fs.readFile(pathname, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.send(`Error getting the file: ${err}.`);
        } else {
          const ext = path.parse(pathname).ext;
          res.setHeader("Content-type", mimeType[ext] || "text/plain");
          res.send(data);
        }
      });
    })
    .catch((error) => {
      res.statusCode = 500;
      res.send(error);
    });
};
