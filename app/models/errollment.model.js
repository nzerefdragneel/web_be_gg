module.exports = (sequelize, Sequelize) => {
    const Enrollment = sequelize.define("enrollments", {
      enrollmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      classId: {
        type: Sequelize.INTEGER
      },
      studentId: {
        type: Sequelize.INTEGER
      },
      enrollmentDate: {
        type: Sequelize.DATE
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      accept: {
        type: Sequelize.BOOLEAN,
      },
    });
  
    return Enrollment;
  };
  