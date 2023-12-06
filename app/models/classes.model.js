module.exports = (sequelize, Sequelize) => {
  const Classes = sequelize.define("classes", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    className: {
      type: Sequelize.STRING
    },
    createAt: {
      type: Sequelize.DATE
    },
    description: {
      type: Sequelize.STRING
    }
  }, {
    timestamps: false, // Disable createdAt and updatedAt
  });

  return Classes;
};
