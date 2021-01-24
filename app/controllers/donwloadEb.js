const fs = require("fs");
var config = require("../../config.json");
const request = require("request");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const { PDFNet } = require("@pdftron/pdfnet-node");
const db = require("../models");
var PdfLib = require('pdf-lib');
var PDFDocument = PdfLib.PDFDocument;
var StandardFonts = PdfLib.StandardFonts;
var rgb = PdfLib.rgb;
var fontkit = require("@pdf-lib/fontkit");
const Account = db.account;
const Ebook = db.ebook;
const LogDownload = db.logDownload;
let file ;

const gc = new Storage({
  keyFilename: config.ebook,
  projectId: "ebook-onlline",
});

exports.download = async (req, res) => {
    createPdf().then(function(pdfBuffer){
 console.log(pdfBuffer);

        res.status(200).type('pdf').send(pdfBuffer)
    })
  
};

    
	

exports.getListFiles = async (req, res) => {
    const directoryPath = __basedir + "/";
    const fileName = req.body.name;
    destFilename = path.join(directoryPath, fileName);
    const options = {
      destination: destFilename,
    };
    file = req.body.name
    
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

    //   const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    //   const pages = pdfDoc.getPages()
    //   pages[0].drawText('This text was added with JavaScript!', {
    //     x: 5,
    //     y: 1000 / 2 + 300,
    //     size: 50,
    //     font: helveticaFont,
    //     color: rgb(0.95, 0.1, 0.1),
    //   })
    //   const pdfBytes = await pdfDoc.save()

    


    // await fs.readdir(directoryPath, function (err, files) {
    //   if (err) {
    //     res.status(500).send({
    //       message: "Unable to scan files!",
    //     });
    //   }

    //   let ext = path.parse(fileName).ext;

    //   if (ext !== ".pdf") {
    //     res.statusCode = 500;
    //     res.end(`File is not a PDF. Please convert it first.`);
    //   }
    //   const inputPath =  path.resolve(__basedir, fileName);
    //   const tempPath = path.resolve(__basedir,"temp.pdf");
    //   fs.rename(inputPath,tempPath,(error)=>{
    //       console.log(error);
    //   });
    //    const outputPath =  path.resolve(__basedir, `${fileName}`);
    //   const main =  async () => {
    //     const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(tempPath);
    //     await pdfdoc.initSecurityHandler();

    //     const stamper = await PDFNet.Stamper.create(
    //       PDFNet.Stamper.SizeType.e_relative_scale,
    //       0.8,
    //       0.8
    //     ); // Stamp size is relative to the size of the crop box of the destination page
    //     stamper.setAlignment(
    //       PDFNet.Stamper.HorizontalAlignment.e_horizontal_center,
    //       PDFNet.Stamper.VerticalAlignment.e_vertical_center
    //     );
    //     const redColorPt = await PDFNet.ColorPt.init(0, 0.5, 0.5);
    //     stamper.setFontColor(redColorPt);
    //     stamper.setOpacity(0.3);
    //     stamper.setRotation(-33);
    //     const pgSet = await PDFNet.PageSet.createRange(
    //       1,
    //       await pdfdoc.getPageCount()
    //     );
          
    //     stamper.stampText(pdfdoc, account.firstname, pgSet);
    //     pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
    //   };
    //    PDFNetEndpoint(main, outputPath);

      let url = "http://localhost:8080/api/files/" + fileName;
      res.status(200).send(url);
    // });
//   } catch(err) {
//     res.status(500).send({
//       message: err.message
//     })
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

const PDFNetEndpoint = (main, pathname) => {
  PDFNet.runWithCleanup(main) // you can add the key to PDFNet.runWithCleanup(main, process.env.PDFTRONKEY)
    .then(() => {
      PDFNet.shutdown();
      fs.readFile(pathname, (err, data) => {});
    });
};


async function createPdf(){
    const directoryPath = __basedir + "/";
    const fileName = file;
    const fontBytes = fs.readFileSync(directoryPath+"app/assets/fonts/THSarabunNew.ttf");
    // var pdfDoc = await PDFDocument.create();
      const fileBytes = fs.readFileSync(directoryPath+fileName)
      const pdfDoc = await PDFDocument.load(fileBytes)

    pdfDoc.registerFontkit(fontkit)
	var helveticaFont = await pdfDoc.embedFont(fontBytes);
	var page = pdfDoc.getPages();
	var { width, height } = page[0].getSize();
	var fontSize = 30;
	page[0].drawText('ทดสอบเว้ยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยยย ทดสอบ', {
		x: 50,
		y: height - 4 * fontSize,
		size: fontSize,
		font: helveticaFont,
		color: rgb(0, 0.53, 0.71),
	});
    var pdfBytes = await pdfDoc.save();
    var pdfBuffer = Buffer.from(pdfBytes.buffer, 'binary');
    return pdfBuffer;
}