const controller = require("../controllers/gradeStructure.controller");

module.exports = function (app) {
    app.get(
        "/api/gradeStructure/getById",
        controller.getGradeStructureByClassId
    );

    app.post("/api/gradeStructure/create", controller.createGradeStructure);

    app.post("/api/gradeStructure/update", controller.updateGradeStructure);

    app.post(
        "/api/gradeStructure/addAssignment",
        controller.addAssignmentToGrade
    );

    app.delete("/api/gradeStructure/delete", controller.deleteGradeStructure);

    app.post(
        "/api/gradeStructure/updateGradePosition",
        controller.updateGradePosition
    );
};
