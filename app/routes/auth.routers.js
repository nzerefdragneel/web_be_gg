const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const router = require("express").Router();

router.post("/signin", controller.signin);

module.exports = router