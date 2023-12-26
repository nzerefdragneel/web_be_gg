
const controller = require("../controllers/scoring.controller");

module.exports = function(app) {
  app.get("/api/score/getall",controller.getallscore);
};