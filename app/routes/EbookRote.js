const controller = require("../controllers/ListEbook");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
      app.post("/api/ebook/add", controller.AddEbook);
      app.get("/api/ebook/findaccount", controller.AccountFindAll);
      app.get("/api/ebookfindall", controller.listFiles);
      app.post("/api/AccountFindEbook", controller.AccountFindEbook);
}
