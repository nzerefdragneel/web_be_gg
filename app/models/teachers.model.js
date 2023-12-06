module.exports = (sequelize, Sequelize) => {
    const Teacher = sequelize.define("teachers", {
      teacherId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      classId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      accept:{
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  
    return Teacher;
  };
  