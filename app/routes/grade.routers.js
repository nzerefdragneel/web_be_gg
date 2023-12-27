const controller = require("../controllers/grade.controller");

module.exports = function (app) {
    app.post("/api/grade/create", controller.createGrade);
    app.get("/api/grade/getById", controller.getGradeByClassId);
    app.post("/api/grade/update", controller.updateGrade);
    app.delete("/api/grade/delete", controller.deleteGrade);
};
