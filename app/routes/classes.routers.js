const classes = require("../controllers/classes.controller");
module.exports = function (app) {
  app.post("/api/classes/create", classes.createClass);
  app.get("/api/classes/getall", classes.getAllClass);
  app.post("/api/classes/delete", classes.deleteClass);
  app.post("/api/classes/update", classes.updateClass);
  app.get("/api/classes/getbyid", classes.getClassById);
  app.get("/api/classes/getbyteacherid", classes.getClassByTeacherId);
  app.get("/api/classes/getbystudentid", classes.getClassByStudentId);
  app.post("/api/classes/invitestudent", classes.inviteStudent);
  app.post("/api/classes/inviteteacher", classes.inviteTeacher);
  app.post("/api/classes/acceptInvitation", classes.acceptInvitation);
  app.get("/api/classes/getstudentinclass", classes.getStudentInClass);
  app.get("/api/classes/getteacherinclass", classes.getTeacherInClass);
};
