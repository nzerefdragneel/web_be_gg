const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
module.exports = function (app) {
  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signup
  );
  app.post("/api/auth/signin", controller.signin);
  app.get("/api/auth/verify", controller.verify);

  app.post("/api/auth/forgot-password", controller.forgotPassword);
  app.get("/api/auth/reset-password/:email", controller.sendResetForm);
};
