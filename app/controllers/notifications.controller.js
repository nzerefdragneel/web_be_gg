const { raw } = require("express");
const exp = require("constants");
const db = require("../models");
const mailer = require("../utils/mailer");
const classes = db.classes;
const teachers = db.teachers;
const users = db.user;
const enrollments = db.enrollment;
const assignment = db.assignment;
const scorings = db.scorings;
const notifications = db.notifications;
const { Op } = require('sequelize');
const { create } = require("domain");
require("dotenv").config();
const gradeStructures = db.gradeStructures;

exports.createNotification = async (req, res) => {  
    const { title, content, classId, userId, assignmentId, type} = req.body;
    const selectedClass = await classes.findByPk(classId);
    if (!title || !content || !classId || !userId) {
        return res.status(400).send({
            message: "Missing some fields!",
        });
        }   
    if (!selectedClass) {
      return res.status(400).send({ message: "Class not found!" });
    }
    const user = await users.findByPk(userId);
    if (!user) {
      return res.status(400).send({ message: "User not found!" });
    }
    if (assignmentId!==null && assignmentId!==undefined){
        const selectedAssignment = await assignment.findByPk(assignmentId);
        if (!selectedAssignment) {
            return res.status(400).send({ message: "Assignment not found!" });
        }
    }
    const createNotification = await notifications.create({
      title: title,
      content: content,
      classId: classId,
      type: type,
      userId: userId,
      assignmentId: assignmentId
    });
    return res.status(201).send({
      message: "Created notification success!",
      data: {
        id: createNotification.id,
        title: createNotification.title,
        content: createNotification.content,
        classId: createNotification.classId,
        type:type,
        assignmentId:createNotification.assignmentId,
        teacherId: createNotification.teacherId,
      },
    });
}
exports.getNotificationByUserID = async (req, res) => {
    const {userId} = req.query;
    console.log(userId)
    const user = await users.findByPk(userId);
    if (!user) {
      return res.status(400).send({ message: "User not found!" });
    }
    const notificationsByUserId = await notifications.findAll({
        where: { userId: userId },
        include: [
            {
                model: classes,
                as: "classNotification",
                attributes: ["id", "className"],
            },
            {
                model: assignment,
                as: "assignmentNotification",
            },
        ],
    });
    if (!notificationsByUserId) {
        return res.status(400).send({ message: "Notification not found!" });
    }
    return res.status(200).send(notificationsByUserId);
}

exports.getNotificationByClassID = async (req, res) => {
    const classId = req.query.classId;
    const selectedClass = await classes.findByPk(classId);
    if (!selectedClass) {
      return res.status(400).send({ message: "Class not found!" });
    }
    const notificationsByClassId = await notifications.findAll({
        where: { classId: classId },
        include: [
            {
                model: classes,
                as: "classNotification",
                attributes: ["id", "className"],
            },
            {
                model: assignment,
                as: "assignmentNotification",
            },
        ],
    });
    if (!notificationsByClassId) {
        return res.status(400).send({ message: "Notification not found!" });
    }
    return res.status(200).send(notificationsByClassId);
}
