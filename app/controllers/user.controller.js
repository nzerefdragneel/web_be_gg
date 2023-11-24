const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.edituser = (req, res) => {
  console.log(req.body);
  if (!req.body.username && !req.body.email && !req.body.password) {
    res.status(500).send({ message: "Nothing change!" });
  } else {
    User.findByPk(req.body.userId)
      .then((user) => {
        if (!user) {
          res.send({ message: "User not found!" });
        }
        // Cập nhật thông tin người dùng

        user.username = req.body.username;
        user.email = req.body.email;
        user.updatedAt = Date.now().toString();
        if (req.body.password != "" || req.body.password != null) {
          var has = bcrypt.hashSync(req.body.password, 8);
          user.password = has;
        } else {
          user.password = user.password;
        }
        // Lưu thay đổi vào cơ sở dữ liệu
        user.save();
        const password = req.body.password;
        const accessToken = jwt.sign({ password }, config.secret, {
          expiresIn: 3600, // 1 hour
        });
        console.log(accessToken);
        res.status(200).send({
          message: "Update Success!",
          id: user.id,
          username: user.username,
          accessToken: accessToken,
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }
};
