module.exports = (sequelize, Sequelize) => {
    const TeachingAssignment = sequelize.define("teachingAssignments", {
      assignmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      classId: {
        type: Sequelize.INTEGER
      },
      teacherId: {
        type: Sequelize.INTEGER
      },
      start: {
        type: Sequelize.DATE
      },
      end: {
        type: Sequelize.DATE
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  
    return TeachingAssignment;
  };
  