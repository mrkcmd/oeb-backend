const { verifySignUp } = require("../middleware");
const controller = require("../controllers/AuthController");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post(
      "/api/auth/signupAdmin",
      [
        verifySignUp.checkDuplicateEmail,
        verifySignUp.checkRolesExisted
      ],
      controller.signupAdmin
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/logout", controller.logOut);
  app.post("/api/auth/autologout", controller.AutoLogOut);
  

};
