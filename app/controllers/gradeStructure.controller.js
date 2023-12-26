const db = require("../models");
const GradeStructures = db.gradeStructures;
const Classes = db.classes;
const Assignments = db.assignment;

exports.getGradeStructureByClassId = (req, res) => {
    if (!req.query.id) {
        res.status(500).send({ message: "Can't find!" });
    } else {
        GradeStructures.findAll({
            where: { classId: req.query.id },
        })
            .then((data) => {
                res.status(200).send({ message: "Success!", data: data });
            })
            .catch((err) => {
                res.status(500).send({ message: err.message });
            });
    }
};

exports.createGradeStructure = async (req, res) => {
    if (!req.body) {
        res.status(500).send({ message: "Can't find!" });
    } else {
        if (
            !req.body.classId ||
            !req.body.gradeScale ||
            !req.body.gradePosition ||
            !req.body.name
        ) {
            return res.status(400).send({
                message: "Missing some fields!",
            });
        }
        const { name, gradeScale, classId, gradePosition, assignmentId } =
            req.body;

        const selectedClass = await Classes.findByPk(classId);

        if (!selectedClass) {
            return res.status(400).send({ message: "Class not found!" });
        }

        const assignment = await Assignments.findOne({
            where: { assignmentId: assignmentId, classId: classId },
        });

        if (!assignment) {
            return res.status(400).send({ message: "Assignment not found!" });
        }

        const createGradeStructure = await GradeStructures.create({
            name: name,
            gradeScale: gradeScale,
            classId: classId,
            gradePosition: gradePosition,
            assignmentId: assignmentId,
            createdAt: new Date(Date.now()),
        });

        return res.status(201).send({
            message: "Created grade structure success!",
            data: {
                id: createGradeStructure.id,
                name: createGradeStructure.name,
                gradeScale: createGradeStructure.gradeScale,
                classId: createGradeStructure.classId,
                gradePosition: createGradeStructure.gradePosition,
                assignmentId: createGradeStructure.assignmentId,
            },
        });
    }
};

exports.addAssignmentToGrade = async (req, res) => {
    if (!req.body) {
        res.status(500).send({ message: "Can't find!" });
    } else {
        if (!req.body.classId || !req.body.assignmentId || !req.body.gradeId) {
            return res.status(400).send({
                message: "Missing some fields!",
            });
        }

        const { gradeId, classId, assignmentId } = req.body;

        const selectedGrade = await GradeStructures.findByPk(gradeId);

        if (!selectedGrade) {
            return res.status(400).send({ message: "Grade not found!" });
        }

        const assignment = await Assignments.findOne({
            where: { assignmentId: assignmentId, classId: classId },
        });

        if (!assignment) {
            return res.status(400).send({ message: "Assignment not found!" });
        }

        const grade = await GradeStructures.update(
            {
                assignmentId: assignmentId,
            },
            { where: { id: gradeId } }
        );

        return res.status(201).send({
            message: "Add assignment to grade success!",
            data: grade,
        });
    }
};

exports.updateGradeStructure = async (req, res) => {
    if (!req.body) {
        res.status(500).send({ message: "Can't find!" });
    } else {
        if (!req.body.gradeId || !req.body.name || !req.body.gradeScale) {
            return res.status(400).send({
                message: "Missing some fields!",
            });
        }

        const { gradeId, name, gradeScale } = req.body;

        const selectedGrade = await GradeStructures.findByPk(gradeId);

        if (!selectedGrade) {
            return res.status(400).send({ message: "Grade not found!" });
        }

        const grade = await GradeStructures.update(
            {
                name: name,
                gradeScale: gradeScale,
            },
            { where: { id: gradeId } }
        );

        return res.status(201).send({
            message: "Update grade success!",
            data: grade,
        });
    }
};

exports.deleteGradeStructure = async (req, res) => {
    if (!req.query.gradeId) {
        res.status(500).send({ message: "Can't find!" });
    } else {
        const { gradeId } = req.query;
        const selectedGrade = await GradeStructures.findByPk(gradeId);

        if (!selectedGrade) {
            return res.status(400).send({ message: "Grade not found!" });
        }

        const grade = await GradeStructures.destroy({
            where: { id: gradeId },
        });

        return res.status(201).send({
            message: "Delete grade success!",
            data: grade,
        });
    }
};

exports.updateGradePosition = async (req, res) => {
    if (!req.body) {
        res.status(500).send({ message: "Can't find!" });
    } else {
        if (!req.body.gradeId || !req.body.gradePosition) {
            return res.status(400).send({
                message: "Missing some fields!",
            });
        }

        const { gradeId, gradePosition } = req.body;

        const selectedGrade = await GradeStructures.findByPk(gradeId);

        if (!selectedGrade) {
            return res.status(400).send({ message: "Grade not found!" });
        }

        const grade = await GradeStructures.update(
            {
                gradePosition: gradePosition,
            },
            { where: { id: gradeId } }
        );

        return res.status(201).send({
            message: "Update grade position success!",
            data: grade,
        });
    }
};
