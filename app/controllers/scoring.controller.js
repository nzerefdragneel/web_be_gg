const db = require("../models");
const config = require("../config/auth.config");

exports.getallscore = (req, res) => {
    db.scorings.findAll({
        include: [{
            model: db.users,
            as: "studentenrollment",
            attributes: ["id", "username", "email"],
            through: {
                attributes: ["userId", "scoringId"],
            },
        }, ],
        include: [{
            model: db.classes,
            as: "classenrollment",
            attributes: ["classId", "className", "classDescription"],
        }, ],
        include: [{
            model: db.assignment,
            as: "assignmentScoring",
            attributes: ["assignmentId", "classId", "teacherId", "start"],
        }, ],
        include: [{
            model: db.teachers,
            as: "teacherScoring",
            attributes: ["teacherId", "classId"],
        }, ],
        include: [{
            model: db.enrollment,
            as: "enrollmentScoring",
            attributes: ["studentId", "classId","enrollmentDate"],
        }, ],

    }).then((scorings) => {
        res.status(200).send({
            message: "get all success!",
            scorings: scorings,
        });
    });
}