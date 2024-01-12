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
const { Op } = require("sequelize");
const { create } = require("domain");
require("dotenv").config();
const gradeStructures = db.gradeStructures;

exports.createNotification = async (req, res) => {
    const { title, content, classId, userId, receiverId, assignmentId } =
        req.body;
    const selectedClass = await classes.findByPk(classId);
    if (!title || !content || !classId || !userId || !receiverId) {
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
    if (assignmentId !== null && assignmentId !== undefined) {
        const selectedAssignment = await assignment.findByPk(assignmentId);
        if (!selectedAssignment) {
            return res.status(400).send({ message: "Assignment not found!" });
        }
    }
    const createNotification = await notifications.create({
        title: title,
        content: content,
        classId: classId,
        userId: userId,
        receiverId: receiverId,
        assignmentId: assignmentId,
    });
    return res.status(201).send({
        message: "Created notification success!",
        data: {
            id: createNotification.id,
            title: createNotification.title,
            content: createNotification.content,
            classId: createNotification.classId,
            assignmentId: createNotification.assignmentId,
            userId: createNotification.userId,
            receiverId: createNotification.receiverId,
        },
    });
};

exports.createBatchNotification = async (req, res) => {
    const { title, content, classId, userId, listReceiverId, assignmentId } =
        req.body;
    const selectedClass = await classes.findByPk(classId);
    if (
        !title ||
        !content ||
        !classId ||
        !userId ||
        !listReceiverId ||
        !assignmentId
    ) {
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
    if (assignmentId !== null && assignmentId !== undefined) {
        const selectedAssignment = await assignment.findByPk(assignmentId);
        if (!selectedAssignment) {
            return res.status(400).send({ message: "Assignment not found!" });
        }
    }
    for (let i = 0; i < listReceiverId.length; i++) {
        await notifications.create({
            title: title,
            content: content,
            classId: classId,
            userId: userId,
            receiverId: listReceiverId[i],
            assignmentId: assignmentId,
        });
    }
    return res.status(201).send({
        message: "Created notification success!",
    });
};
exports.getNotificationByReceiverID = async (req, res) => {
    const { userId } = req.query;
    const user = await users.findByPk(userId);
    if (!user) {
        return res.status(400).send({ message: "User not found!" });
    }
    const notificationsByReceiverId = await notifications.findAll({
        where: { receiverId: userId },
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

    if (!notificationsByReceiverId) {
        return res.status(400).send({ message: "Notification not found!" });
    }
    return res.status(200).send(notificationsByReceiverId);
};

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
};

exports.updateStatusNotification = async (req, res) => {
    const { notificationId, status } = req.body;
    if (!notificationId || !status) {
        return res.status(400).send({ message: "Missing some fields!" });
    }
    if (status !== "read" && status !== "unread") {
        return res.status(400).send({ message: "Status is invalid!" });
    }
    const selectedNotification = await notifications.findByPk(notificationId);
    if (!selectedNotification) {
        return res.status(400).send({ message: "Notification not found!" });
    }
    await notifications.update(
        { status: status },
        { where: { notificationId: notificationId } }
    );
    return res.status(200).send({ message: "Update status success!" });
};
