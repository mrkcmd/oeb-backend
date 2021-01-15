const controller = require("../controllers/GenerateUrl");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
    
      app.post("/api/generateUrl", controller.generateUrl);
      app.post("/api/deleteUrl", controller.deleteUrl);
}