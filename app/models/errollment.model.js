module.exports = (sequelize, Sequelize) => {
    const Enrollment = sequelize.define("enrollments", {
      studentId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      classId: {
        type: Sequelize.INTEGER,
        primaryKey: true
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
      mssv:{
        type: Sequelize.STRING,
      }
    });
  
    return Enrollment;
  };
  