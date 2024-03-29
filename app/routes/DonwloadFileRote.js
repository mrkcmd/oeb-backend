const controller = require("../controllers/donwloadEb");


module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
    
      app.get("/api/files/:name", controller.download);
      app.post("/api/files", controller.getListFiles);
      app.post("/api/deletefile", controller.deleteFile);
}