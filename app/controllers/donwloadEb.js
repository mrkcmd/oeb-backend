const fs = require("fs");
var config = require("../../config.json");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const db = require("../models");
const Account = db.account;
const Ebook = db.ebook;
const LogDownload = db.logDownload;

var PdfLib = require("pdf-lib");
var PDFDocument = PdfLib.PDFDocument;
var StandardFonts = PdfLib.StandardFonts;
var rgb = PdfLib.rgb;
var fontkit = require("@pdf-lib/fontkit");
var degrees = PdfLib.degrees;
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

    let account;

    await Account.findOne({
      where: {
        id: req.body.accountId,
      },
    }).then((data) => {
      account = data;
    });

    await LogDownload.create({
      ebook: fileName,
      date: require("moment")().add(7, "hours").format("DD-MM-YYYY HH:mm:ss"),
      ip: req.body.ip,
      accountId: req.body.accountId,
    });

    Ebook.findOne({
      where: {
        id: req.body.id,
      },
    }).then((data) => {
      Ebook.update(
        {
          downloaded: data.downloaded + 1,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );
    });

    const download = await gc
      .bucket("ebook-online")
      .file(fileName)
      .download(options);

      const fontBytes = fs.readFileSync(directoryPath+"app/assets/fonts/THSarabunNew.ttf");
      const fileBytes = fs.readFileSync(directoryPath+fileName)
      const pdfDoc = await PDFDocument.load(fileBytes)

      let stamText ="คุณ "+ account.firstname+" " +account.lastname+" "+" อีเมล "+account.email+
      "\nได้ทำการดาวน์โหลดเป็นครั้งที่ "+req.body.downloaded+
      "\nโดย IP "+req.body.ip+
      "\nเมื่อวันที่ "+require("moment")().add(7,"hours").format("DD/MM/YYYY")+" เวลา "+require("moment")().add(7, "hours").format("HH:mm:ss")

      pdfDoc.registerFontkit(fontkit);
      var sarabunFont = await pdfDoc.embedFont(fontBytes);
      var page = pdfDoc.getPages();
      var { width, height } = page[0].getSize();
      var fontSize = 30;
      for (let index = 0; index < page.length; index++) {
        page[index].drawText(
           stamText,
          {
            x: width / 4,
            y: (height / 2) - 60,
            size: fontSize,
            opacity: 0.33,
            rotate: degrees(45),
            font: sarabunFont,
            color: rgb(0, 0.53, 0.71),
          }
        );
      }

      fs.writeFileSync("./" + fileName, await pdfDoc.save());

      let url = "http://ebook.taksaonline.com/api/files/" + fileName;

      res.status(200).send(url);
  
};

exports.deleteFile = (req, res) => {
  const fileName = req.body.name;

  const path = __basedir + "/" + fileName;
  const tempPath = __basedir + "/temp.pdf";
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  fs.unlink(tempPath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.status(200).send({
    message: "delete file ",
  });
};

