const nodeMailer = require("nodemailer");
const mailConfig = require("../config/mail.config");
require("dotenv").config();

exports.sendMail = (to, subject, htmlContext) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const options = {
    from: process.env.MAIL_FROM_ADDRESS,
    to: to,
    subject: subject,
    html: htmlContext,
  };

  return transporter.sendMail(options);
};
