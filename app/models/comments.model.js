module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comments", {
      commentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      reviewId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'gradereviews',
          key: 'reviewId'
        }
      },
      commentText: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      commenterId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
      // Add other relevant comment information here
    });
  
    return Comment;
  };
  