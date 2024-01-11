const controller = require("../controllers/notifications.controller");

module.exports = function (app) {
    app.post("/api/notification/create", controller.createNotification);
    app.post(
        "/api/notification/createbatch",
        controller.createBatchNotification
    );
    app.get(
        "/api/notification/getbyreceiverid",
        controller.getNotificationByReceiverID
    );
    app.get(
        "/api/notification/getbyclassid",
        controller.getNotificationByClassID
    );
    app.post(
        "/api/notification/updatestatus",
        controller.updateStatusNotification
    );
};
