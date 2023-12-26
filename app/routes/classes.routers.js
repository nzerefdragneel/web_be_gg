const classes = require("../controllers/classes.controller");
module.exports = function (app) {
    app.post("/api/classes/create", classes.CreateClass);
    app.get("/api/classes/getall", classes.getAllClass);
    app.post("/api/classes/delete", classes.deleteClass);
    app.post("/api/classes/update", classes.updateClass);
    app.get("/api/classes/getbyid", classes.getClassById);
    app.get("/api/classes/getbyteacherid", classes.getClassByTeacherId);
    app.get("/api/classes/getbystudentid", classes.getClassByStudentId);
    app.post("/api/classes/invitestudent", classes.inviteStudent);
    app.get("/api/classes/studentacceptinvite", classes.studentacceptinvite);
    app.post("/api/classes/inviteteacher", classes.inviteTeacher);
    app.get(
        "/api/classes/teacheracceptinvatation",
        classes.acceptTeacherInvitation
    );
    app.get("/api/classes/getstudentinclass", classes.getStudentInClass);
    app.get("/api/classes/getteacherinclass", classes.getTeacherInClass);
};
