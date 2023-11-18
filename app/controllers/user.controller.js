const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
var bcrypt = require("bcryptjs");
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
    if (!req.body.username && !req.body.email && !req.body.password){
        res.status(500).send({ message: "Nothing change!" });
    }
    else{
    User.findByPk(req.body.userId)
    .then(user => {
      if (!user) {
        res.send({ message: "User not found!" });
      }
      // Cập nhật thông tin người dùng
      
      user.username = req.body.username;
      user.email = req.body.email;
      if (req.body.password!="" ||req.body.password!=null){
        user.password = bcrypt.hashSync(req.body.password, 8);}

      // Lưu thay đổi vào cơ sở dữ liệu
      user.save();
      res.status(200).send({ message: "User update successfully!" });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });}
  };
  