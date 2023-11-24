const { verifySignUp } = require("../middleware");
const authController = require("../controllers/auth.controller");
const passwordController = require("../controllers/forgotPassword.controller");
module.exports = function (app) {
  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    authController.signup
  );
  app.post("/api/auth/signin", authController.signin);
  app.get("/api/auth/verify", authController.verify);

  app.post("/api/auth/forgot-password", passwordController.forgotPassword);
  app.post("/api/auth/reset-password", passwordController.resetPassword);
};
