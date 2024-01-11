const controller = require("../controllers/notifications.controller");

module.exports = function (app) {
  app.post("/api/notification/create", controller.createNotification);
  app.post("/api/notification/createbatch", controller.createBatchNotification);
  app.get("/api/notification/getbyuserid", controller.getNotificationByUserID);
  app.get(
    "/api/notification/getbyclassid",
    controller.getNotificationByClassID
  );
};
