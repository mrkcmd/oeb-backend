const fs = require("fs");
var config = require("../../config.json");
const request = require("request");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const { PDFNet } = require("@pdftron/pdfnet-node");
const db = require("../models");
const Account = db.account;
const Ebook = db.ebook;
const LogDownload = db.logDownload;
let ebookId;
const gc = new Storage({
  keyFilename: config.ebook,
  projectId: "ebook-onlline",
});

exports.download = async (req, res) => {
  const directoryPath = __basedir + "/";
  const fileName = req.params.name;

  Ebook.findOne({
    where: {
      id: ebookId,
    },
  }).then((data) => {
    Ebook.update(
      {
        downloaded: data.downloaded + 1,
      },
      {
        where: {
          id: ebookId,
        },
      }
    );
  });

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

exports.getListFiles = async (req, res) => {
  try {
    const directoryPath = __basedir + "/";
    const fileName = req.body.name;

    destFilename = path.join(directoryPath, fileName);
    const options = {
      destination: destFilename,
    };
    ebookId = req.body.id;

    let account;
    let book

    await Account.findOne({
      where: {
        id: req.body.accountId,
      },
    }).then((data) => {
      account = data;
    });
    

    LogDownload.create({
      ebook: fileName,
      date: require("moment")().add(7, "hours").format("DD-MM-YYYY HH:mm:ss"),
      ip: req.body.ip,
      accountId: req.body.accountId,
    });

    Ebook.findOne({
      where: {
        name: fileName
      }
    }).then((ebook) => {
      book = ebook
    })

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

      let ext = path.parse(fileName).ext;

      if (ext !== ".pdf") {
        res.statusCode = 500;
        res.end(`File is not a PDF. Please convert it first.`);
      }
      const inputPath = path.resolve(__basedir, fileName);
      const outputPath = path.resolve(__basedir, `${fileName}`);
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
        const redColorPt = await PDFNet.ColorPt.init(0.5, 0, 0);
        stamper.setFontColor(redColorPt);
        stamper.setOpacity(0.3);
        stamper.setRotation(-40);
        const pgSet = await PDFNet.PageSet.createRange(
          1,
          await pdfdoc.getPageCount()
        );

        let stamtext =
        account.firstname +
        " " + account.lastname +
        "\n" + account.email +
        "\n" + req.body.ip +
        " จำนวนครั้งดาวน์โหลด " + (book.downloaded+1) + 
        " "+ require("moment")().add(7, "hours").format("DD-MM-YYYY HH:mm:ss");

        stamper.stampText(pdfdoc, stamtext, pgSet);

        pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
      };

      PDFNetEndpoint(main, outputPath);

      let url = "https://pdx-ebook.herokuapp.com/api/files/" + fileName;

      res.status(200).send(url);
    });
  } catch(err) {
    res.status(500).send({
      message: err.message
    })
  }
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

const PDFNetEndpoint = (main, pathname) => {
  PDFNet.runWithCleanup(main) // you can add the key to PDFNet.runWithCleanup(main, process.env.PDFTRONKEY)
    .then(() => {
      PDFNet.shutdown();
      fs.readFile(pathname, (err, data) => {});
    });
};
