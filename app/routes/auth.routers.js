const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
module.exports = function(app) {
    app.post(
        "/api/auth/signup",
        [
          verifySignUp.checkDuplicateUsernameOrEmail,
        ],
        controller.signup
      );
    
}