module.exports = (sequelize, Sequelize) => {
  const Notifications = sequelize.define(
    "notifications",
    {
      notificationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      receiverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      classId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      assignmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING(255),
      },
      content: {
        type: Sequelize.STRING(255),
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: "unread",
      },
    },
    {
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  return Notifications;
};
