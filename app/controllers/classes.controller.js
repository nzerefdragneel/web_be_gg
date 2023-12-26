const db = require("../models");
const classes = db.classes;
const teachers = db.teachers;
const users = db.user;
const enrollments = db.enrollment;
const assignment = db.assignment;
const gradeStructures = db.gradeStructures;

exports.CreateClass = async (req, res) => {
    try {
        const { className, description, teacherId } = req.body;

        if (!className || !description || !teacherId) {
            return res
                .status(400)
                .send({ message: "Please fill all required fields!" });
        }

        const createdClass = await classes.create({
            className: className,
            description: description,
            createdAt: new Date(Date.now()),
        });

        const teacher = await users.findByPk(teacherId);

        if (!teacher) {
            return res.status(404).send({ message: "Teacher not found!" });
        }

        await teachers.create({
            classId: createdClass.id,
            teacherId: teacherId,
            accept: true,
        });

        return res.status(200).send({
            message: "Create Class Success!",
            data: {
                classId: createdClass.id,
                className: createdClass.className,
                classDescription: createdClass.description,
                teacherName: teacher.username,
                teacherId: teacher.id,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};
const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? (page - 1) * limit : 0;

    return { limit, offset };
};

// Example getPagingData function
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: classes } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, classes, totalPages, currentPage };
};

exports.getAllClass = async (req, res) => {
    try {
        const { id, page, size } = req.query;
        var condition = id ? { id: id } : null;
        const { limit, offset } = getPagination(page, size);

        const data = await classes.findAndCountAll({
            limit,
            offset,
        });

        const response = getPagingData(data, page, limit);
        res.send(response);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};
// Assuming getPagination and getPagingData functions are defined elsewhere in your code

//xóa các bảng liên quan đến class

exports.deleteClass = async (req, res) => {
    try {
        const { id } = req.body;
        console.log(req.body);
        await assignment.destroy({
            where: { classId: id },
        });

        await enrollments.destroy({
            where: { classId: id },
        });

        await teachers.destroy({
            where: { classId: id },
        });

        await classes.destroy({
            where: { id: id },
        });

        await gradeStructures.destroy({
            where: { classId: id },
        });

        res.status(200).send({ message: "Delete Success!" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};

exports.updateClass = (req, res) => {
    const { id, className, description } = req.body;
    if (!className && !description) {
        res.status(400).send({
            message: "Please provide at least one field to update!",
        });
    } else {
        classes
            .update(
                {
                    className: className,
                    description: description,
                    createAt: new Date(Date.now()),
                },
                {
                    where: { id: id },
                }
            )
            .then((result) => {
                if (result[0] === 1) {
                    res.status(200).send({ message: "Update Success!" });
                } else {
                    res.status(404).send({
                        message: "Class not found or no changes to update.",
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({ message: err.message });
            });
    }
};

exports.getClassById = (req, res) => {
    const { id } = req.query;
    classes
        .findOne({
            where: { id: id },
        })
        .then((data) => {
            res.status(200).send({ message: "Success!", data: data });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};
exports.getClassByTeacherId = (req, res) => {
    const { id } = req.query;
    teachers
        .findAll({
            where: { teacherId: id },
        })
        .then((data) => {
            res.status(200).send({ message: "Success!", data: data });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};
exports.getClassByStudentId = (req, res) => {
    const { id } = req.query;
    enrollments
        .findAll({
            where: { studentId: id },
        })
        .then((data) => {
            res.status(200).send({ message: "Success!", data: data });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};
exports.inviteStudent = (req, res) => {
    const { id, studentId } = req.body;
    console.log(req.body);
    enrollments
        .create({
            classId: id,
            studentId: studentId,
            enrollmentDate: new Date(Date.now()),
        })
        .then((data) => {
            res.status(200).send({ message: "Invite Success!" });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};
exports.studentacceptinvite = (req, res) => {
    const { studentId, classId } = req.query;
    console.log(studentId, classId);
    enrollments
        .update(
            { accept: true }, // Assuming 'accepted' is the column that tracks acceptance
            {
                where: {
                    studentId: studentId,
                    classId: classId,
                },
            }
        )
        .then((result) => {
            if (result[0] === 1) {
                res.status(200).send({ message: "Acceptance Success!" });
            } else {
                res.status(404).send({
                    message: "Enrollment not found or no change.",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

exports.getStudentInClass = (req, res) => {
    const { id } = req.query;
    enrollments
        .findAll({
            where: { classId: id, accept: true },
            include: [
                {
                    model: users,
                    attributes: ["fullname", "username"], // Specify the attributes you want to retrieve from the User model
                    as: "studentenrollment", // Assuming there is a foreign key named userId in the Teacher model
                },
            ],
        })
        .then((data) => {
            res.status(200).send({ message: "Success!", data: data });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};
exports.inviteTeacher = (req, res) => {
    const { id, teacherId } = req.body;
    teachers
        .create({
            classId: id,
            teacherId: teacherId,
        })
        .then((data) => {
            res.status(200).send({ message: "Invite Success!" });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};
exports.acceptTeacherInvitation = (req, res) => {
    const { teacherId, classId } = req.query;

    // Assuming you have a teachers table/model with an 'accepted' column
    teachers
        .update(
            { accept: true }, // Assuming 'accepted' is the column that tracks acceptance
            {
                where: {
                    teacherId: teacherId,
                    classId: classId,
                },
            }
        )
        .then((result) => {
            if (result[0] === 1) {
                res.status(200).send({
                    message: "Teacher Invitation Accepted!",
                });
            } else {
                res.status(404).send({
                    message:
                        "Teacher invitation not found or no changes to update.",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

exports.getTeacherInClass = (req, res) => {
    const { id } = req.query;
    teachers
        .findAll({
            where: { classId: id, accept: true },
            include: [
                {
                    model: users,
                    attributes: ["fullname", "username"], // Specify the attributes you want to retrieve from the User model
                    as: "teacher", // Assuming there is a foreign key named userId in the Teacher model
                },
            ],
        })
        .then((data) => {
            res.status(200).send({ message: "Success!", data: data });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};
