module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    verified: {
      type: Sequelize.BOOLEAN,
    },
    roles:{
      type: Sequelize.STRING,
    },
    type:{
      type: Sequelize.STRING,
    },
    fbID:{
      type: Sequelize.STRING,
    },
  });

  return User;
};
