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
  app.get("/api/auth/google", controller.googleSignin)
  app.get("/api/auth/google/callback", controller.googleSigninCallback)
  app.get("/api/auth/facebook", controller.facebookSignin)
  app.get("/api/auth/facebook/callback", controller.facebookSigninCallback)
  // app.get("/api/auth/facebook", controller.facebookSigninCallback)
};
