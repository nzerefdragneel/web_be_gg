module.exports = (sequelize, Sequelize) => {
    const Scorings = sequelize.define("scorings", {
    studentId: {
    type: Sequelize.INTEGER,
    primaryKey: true
    },
    classId: {
    type: Sequelize.INTEGER,
    primaryKey: true
    },
    createdAt: {
    type: Sequelize.DATE,
    },
    updatedAt: {
    type: Sequelize.DATE,
    },
    score: {
        type: Sequelize.INTEGER,
    },
    teacherId: {
        type: Sequelize.INTEGER,
    },
    assignmentId: {
        type: Sequelize.INTEGER,
    },

    });
  
    return Scorings;
  };
  
