const { verifySignUp } = require("../middleware");
const authController = require("../controllers/auth.controller");
const passwordController = require("../controllers/forgotPassword.controller");
const passport = require("passport");
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
  app.get("/api/auth/google", authController.googleSignin)
  app.get("/api/auth/google/callback", authController.googleSigninCallback)
  app.get("/api/auth/facebook", authController.facebookSignin)
  app.get("/api/auth/facebook/callback", authController.facebookSigninCallback)


  

};
