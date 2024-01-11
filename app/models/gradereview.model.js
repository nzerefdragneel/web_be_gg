module.exports = (sequelize, Sequelize) => {
  const GradeReview = sequelize.define(
    "gradereviews",
    {
      reviewId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      studentId: {
        type: Sequelize.INTEGER,
      },
      classId: {
        type: Sequelize.INTEGER,
      },
      assignmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      gradeComposition: {
        type: Sequelize.STRING(255),
      },
      currentGrade: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      expectationGrade: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      studentExplanation: {
        type: Sequelize.TEXT,
      },
      final_decision: {
        type: Sequelize.STRING(255),
      },
      createAt: {
        type: Sequelize.DATE,
      },
      updateAt: {
        type: Sequelize.DATE,
      },
    },
    {
      timestamps: false, // Disable Sequelize's default timestamps (createdAt and updatedAt)
    }
  );

  return GradeReview;
};
