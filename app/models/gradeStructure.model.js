module.exports = (sequelize, Sequelize) => {
    const GradeStructures = sequelize.define("gradeStructures", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        gradeScale: {
            type: Sequelize.INTEGER,
        },
        classId: {
            type: Sequelize.INTEGER,
        },
        assignmentId: {
            type: Sequelize.INTEGER,
        },
        gradePosition: {
            type: Sequelize.INTEGER,
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        },
    });

    return GradeStructures;
};
