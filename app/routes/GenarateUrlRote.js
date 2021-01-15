const controller = require("../controllers/GenarateUrl");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
    
      app.post("/api/genarateUrl", controller.genarateUrl);
      app.post("/api/deleteUrl", controller.deleteUrl);
}