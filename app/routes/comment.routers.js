const controller = require("../controllers/comment.controller");

module.exports = function (app) {
    app.post("/api/comment/create", controller.createComment);
};
