const controller = require("../controllers/grade.controller");

module.exports = function (app) {
  app.post("/api/grade/create", controller.createGrade);
  app.get("/api/grade/getById", controller.getGradeByClassId);
  app.post("/api/grade/update", controller.updateGrade);
  app.delete("/api/grade/delete", controller.deleteGrade);
  app.post("/api/grade/updatePosition", controller.updateGradePosition);
  app.get("/api/grade/getSingleAssignment", controller.getSingleAssignment);
  app.post(
    "/api/grade/getSingleStudentScore",
    controller.getSingleStudentScore
  );
  app.get(
    "/api/grade/getGradeByAssignmentId",
    controller.getGradeByAssignmentId
  );
  app.post("/api/grade/updateScore", controller.updateAssignmentGradeOfStudent);
  app.post("/api/grade/updateBatchScore", controller.updateBatchScore);
  app.post("/api/grade/finalize", controller.finalizeGrade);
};
