const controller = require("../controllers/gradereview.controller");

module.exports = function (app) {
    app.post("/api/gradereview/create", controller.createGradeReview);
    app.get("/api/gradereview/getGradeReviewByStudentId", controller.getGradeReviewByStudentId);
    app.get("/api/gradereview/getGradeReviewByClassId", controller.getGradeReviewByClassId);
    
    app.post("/api/gradereview/updateAcceptedGradeReview", controller.updateAcceptedGradeReview);
    app.get("/api/gradereview/getGradeReviewByAssignmentId", controller.getGradeReviewByAssignmentId);
  };
  