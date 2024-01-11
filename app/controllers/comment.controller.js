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

exports.createComment = async (req, res) => {
  const { reviewId, comment, commenterId } = req.body;
  if (
    reviewId === undefined ||
    comment === undefined ||
    commenterId === undefined
  ) {
    return res.status(400).send({
      message: "Missing some fields!",
    });
  }
  const selectedReview = await GradeReview.findByPk(reviewId);
  if (!selectedReview) {
    return res.status(400).send({ message: "Review not found!" });
  }
  const createComment = await Comments.create({
    reviewId: reviewId,
    commentText: comment,
    commenterId: commenterId,
    createAt: new Date(Date.now()),
  });
  return res.status(200).send(createComment);
};
