const db = require("../models");
const config = require("../config/auth.config");
const { where } = require("sequelize");
const Grade = db.assignment;
const scorings = db.scorings;
const Teachers = db.teachers;
const Students = db.enrollment;
const Classes = db.classes;
const GradeReview = db.gradeviews;
const Comments = db.comments;
const { Op } = require("sequelize");
exports.createGradeReview = async (req, res) => {
  const {
    studentId,
    assignmentId,
    classId,
    currentGrade,
    expectationGrade,
    studentExplanation,
  } = req.body;
  if (
    studentId === undefined ||
    assignmentId === undefined ||
    classId === undefined ||
    currentGrade === undefined ||
    expectationGrade === undefined ||
    studentExplanation === undefined
  ) {
    return res.status(400).send({
      message: "Missing some fields!",
    });
  }
  const selectedAssignment = await Grade.findByPk(assignmentId);
  if (!selectedAssignment) {
    return res.status(400).send({ message: "Assignment not found!" });
  }
  const selectedClass = await Classes.findByPk(classId);
  if (!selectedClass) {
    return res.status(400).send({ message: "Class not found!" });
  }
  const selectedStudent = await Students.findOne({
    where: { studentId: studentId, classId: classId },
  });
  if (!selectedStudent) {
    return res.status(400).send({ message: "Student not found!" });
  }
  const selectedGradeReview = await GradeReview.findOne({
    where: {
      studentId: studentId,
      assignmentId: assignmentId,
      final_decision: { [Op.is]: null },
    },
  });
  if (selectedGradeReview) {
    return res.status(400).send({ message: "Grade review already existed!" });
  }
  const createGradeReview = await GradeReview.create({
    studentId: studentId,
    assignmentId: assignmentId,
    classId: classId,
    currentGrade: currentGrade,
    expectationGrade: expectationGrade,
    studentExplanation: studentExplanation,
    createdAt: new Date(Date.now()),
  });
  return res.status(201).send({
    message: "Created grade review success!",
    data: {
      id: createGradeReview.id,
      studentId: createGradeReview.studentId,
      assignmentId: createGradeReview.assignmentId,
      classId: createGradeReview.classId,
      gradeComposition: createGradeReview.gradeComposition,
      currentGrade: createGradeReview.currentGrade,
      expectationGrade: createGradeReview.expectationGrade,
      studentExplanation: createGradeReview.studentExplanation,
    },
  });
};
exports.getGradeReviewByStudentId = async (req, res) => {
  const studentId = req.query.studentId;
  const selectedGradeReview = await GradeReview.findAll({
    where: { studentId: studentId },
  });
  if (!selectedGradeReview) {
    return res.status(400).send({ message: "Grade review not found!" });
  }
  return res.status(200).send({
    message: "Get grade review success!",
    data: selectedGradeReview,
  });
};
exports.getGradeReviewByClassId = async (req, res) => {
  const classId = req.query.classId;
  const selectedGradeReview = await GradeReview.findAll({
    where: { classId: classId, final_decision: { [Op.is]: null } },
  });
  console.log(selectedGradeReview);
  if (!selectedGradeReview) {
    return res.status(400).send({ message: "Grade review not found!" });
  }
  return res.status(200).send({
    message: "Get grade review success!",
    data: selectedGradeReview,
  });
};
exports.getGradeReviewByAssignmentId = async (req, res) => {
  const { assignmentId, classId } = req.query;
  const selectedGradeReview = await GradeReview.findAll({
    where: { assignmentId: assignmentId, classId: classId },
  });
  if (!selectedGradeReview) {
    return res.status(400).send({ message: "Grade review not found!" });
  }
  return res.status(200).send({
    message: "Get grade review success!",
    data: selectedGradeReview,
  });
};
exports.updateAcceptedGradeReview = async (req, res) => {
  const { id, final_decision } = req.body;
  if (id === undefined || final_decision === undefined) {
    return res.status(400).send({
      message: "Missing some fields!",
    });
  }
  const selectedGradeReview = await GradeReview.findByPk(id);
  if (!selectedGradeReview) {
    return res.status(400).send({ message: "Grade review not found!" });
  }
  //đổi điểm cho học sinh

  if (final_decision == "accepted") {
    const selectedGrade = await scorings.findOne({
      where: {
        studentId: selectedGradeReview.studentId,
        assignmentId: selectedGradeReview.assignmentId,
        classId: selectedGradeReview.classId,
      },
    });
    if (!selectedGrade) {
      return res.status(400).send({ message: "Grade not found!" });
    }

    selectedGrade.score = selectedGradeReview.expectationGrade;
    selectedGrade.save();
  }

  selectedGradeReview.final_decision = final_decision;
  selectedGradeReview.save();

  return res.status(200).send({
    message: "Update grade review success!",
    data: selectedGradeReview,
  });
};
exports.getGradeReviewByStudentIdAndClassId = async (req, res) => {
  const { studentId, classId } = req.query;
  const selectedGradeReview = await GradeReview.findAll({
    where: {
      studentId: studentId,
      classId: classId,
    },
  });
  if (!selectedGradeReview) {
    return res.status(400).send({ message: "Grade review not found!" });
  }
  return res.status(200).send({
    message: "Get grade review success!",
    data: selectedGradeReview,
  });
};
exports.getGradeReviewByStudentIdAndAssignmentId = async (req, res) => {
  const { studentId, assignmentId } = req.query;
  const selectedGradeReview = await GradeReview.findOne({
    where: {
      studentId: studentId,
      assignmentId: assignmentId,
      final_decision: { [Op.is]: null },
    },
  });
  if (!selectedGradeReview) {
    return res.status(400).send({ message: "Grade review not found!" });
  }
  const listComments = await Comments.findAll({
    where: { reviewId: selectedGradeReview.dataValues.reviewId },
  });
  return res.status(200).send({
    message: "Get grade review success!",
    data: selectedGradeReview,
    comments: listComments,
  });
};
