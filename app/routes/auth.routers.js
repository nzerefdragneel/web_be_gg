const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
        ],
        controller.signup
    );
    app.post("/api/auth/signin", controller.signin);
    app.get("/api/auth/google", controller.googleSignin)
    app.get("/api/auth/google/callback", controller.googleSigninCallback)
    app.get("/api/auth/facebook", controller.facebookSignin)
    app.get("/api/auth/facebook/callback", controller.facebookSigninCallback)
    // app.get("/api/auth/facebook", controller.facebookSigninCallback)
}