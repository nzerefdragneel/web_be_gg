const db = require("../models");
const mailer = require("../utils/mailer");
const classes = db.classes;
const teachers = db.teachers;
const users = db.user;
const enrollments = db.enrollment;
const assignment = db.assignment;
const crypto = require("crypto");
require("dotenv").config();

exports.createClass = async (req, res) => {
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

function encrypt(text, password) {
  const iv = crypto.randomBytes(16);

  // Hash password
  const key = crypto.scryptSync(password, "salt", 24);

  const cipher = crypto.createCipheriv("aes192", key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");

  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(encrypted, password) {
  const textParts = encrypted.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");

  const key = crypto.scryptSync(password, "salt", 24);

  const encryptedText = textParts.join(":");

  const decipher = crypto.createDecipheriv("aes192", key, iv);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");

  decrypted += decipher.final("utf8");

  return decrypted;
}

exports.generateClassroomLink = async (req, res) => {
  const { classId, isTeacher } = req.query;
  if (!classId ) {
    return res
      .status(400)
      .send({ message: "Please fill all required fields!" });
  }

  const hashedClassId = encrypt(classId, process.env.SECRET);
  const hashedtecher = encrypt(isTeacher, process.env.SECRET);

  const link = `${process.env.APP_URL}/invitation?id=${hashedClassId}&isTeacher=${hashedtecher}`;
  return res.status(200).send({ message: "Success!", data: link });
};

exports.acceptInvitation = async (req, res) => {
  try {
    const { userId, classId, isTeacher } = req.body;

    if (!userId || !classId) {
      return res.status(400).send({ message: "Invalid invitation" });
    }

    const decryptedClassId = decrypt(classId, process.env.SECRET);
    const decryptedIsTeacher = decrypt(isTeacher, process.env.SECRET);
    console.log(decryptedClassId) ;
    console.log(decryptedIsTeacher) ;

    if (decryptedIsTeacher === "true") {
      teachers
        .findOne({ where: { classId: decryptedClassId, teacherId: userId } })
        .then((result) => {
          if (!result) {
            teachers
              .create({
                classId: decryptedClassId,
                teacherId: userId,
                accept: true,
              })
              .catch((err) => {
                console.error(err);
                res.status(500).send({ message: err.message });
              });
          }
          return res.status(200).send({ message: "Success!" });
        });
    } else {
      enrollments
        .findOne({ where: { classId: decryptedClassId, studentId: userId } })
        .then((result) => {
          if (!result) {
            enrollments
              .create({
                classId: decryptedClassId,
                studentId: userId,
                enrollmentDate: new Date(Date.now()),
                accept: true,
              })
              .catch((err) => {
                console.error(err);
                res.status(500).send({ message: err.message });
              });
          }
          return res.status(200).send({ message: "Success!" });
        });
    }
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
    if (!id) {
      return res
        .status(400)
        .send({ message: "Please fill all required fields!" });
    }

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

    res.status(200).send({ message: "Delete Success!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

exports.updateClass = (req, res) => {
  const { id, className, description } = req.body;
  if (!className && !description) {
    res
      .status(400)
      .send({ message: "Please provide at least one field to update!" });
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
          res
            .status(404)
            .send({ message: "Class not found or no changes to update." });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }
};

exports.getClassById = (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).send({ message: "Please provide class id!" });
  };
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
  if (!id) { 
    res.status(400).send({ message: "Please provide teacher id!" });
  };
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
  if (!id) {  
    res.status(400).send({ message: "Please provide student id!" });
  };
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
  const { studentEmail, classId } = req.query;
if (!studentEmail || !classId) {  
  res.status(400).send({ message: "Please provide student email and class id!" });
};
  const hashedClassId = encrypt(classId, process.env.SECRET);
  const hashedtecher = encrypt("false", process.env.SECRET);

  mailer
    .sendMail(
      studentEmail,
      "Invitation to join class",
      `<p>Click <a href="${process.env.APP_URL}/invitation?id=${hashedClassId}&isTeacher=${hashedtecher}">here</a> to join your classroom.</p>`
    )
    .then(() => {
      res.status(201).send({
        message:
          "Invitation sent! Please check your email to join the classroom.",
      });
    });
};

exports.getStudentInClass = (req, res) => {
  const { id } = req.query;
  if (!id) {  
    res.status(400).send({ message: "Please provide class id!" });
  }
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
  const {  classId,teacherEmail } = req.query;
  if (!teacherEmail || !classId) {  
    res.status(400).send({ message: "Please provide teacher email and class id!" });
  }

  const hashedClassId = encrypt(classId, process.env.SECRET);
  const hashedtecher = encrypt("true", process.env.SECRET);

  mailer
    .sendMail(
      teacherEmail,
      "Invitation to join class",
      `<p>Click <a href="${process.env.APP_URL}/invitation?id=${hashedClassId}&isTeacher=${hashedtecher}">here</a> to join your classroom.</p>`
    )
    .then(() => {
      res.status(201).send({
        message:
          "Invitation sent! Please check your email to join the classroom.",
      });
    });
};
exports.isTeacher = (req, res) => {
  const { classId, userId } = req.query;
  console.log(req.query);
  if  (!classId || !userId) { 
    res.status(400).send({ message: "Please provide class id and user id!" });
  }
  teachers
    .findOne({ where: { classId: classId, teacherId: userId } })
    .then((result) => {
      if (result) {
        res.status(200).send({ message: "Success!", data: true });
      } else {
        res.status(200).send({ message: "Success!", data: false });
      }
    });
};

exports.getTeacherInClass = (req, res) => {
  const { id } = req.query;
  if (!id) {  
    res.status(400).send({ message: "Please provide class id!" });
  }
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
