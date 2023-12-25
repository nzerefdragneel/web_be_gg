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
        user.fullname=req.body.fullname;
        user.active=req.body.active;
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
exports.getuserroles = (req, res) => {
  console.log(req.query)
  if (!req.query.id) {
    res.status(500).send({ message: "Can't find!" });
  } else {
    User.findByPk(req.query.id)
      .then((user) => {
        if (!user) {
          res.status(500).send({ message: "User not found!" });
        }
        res.status(200).send({
          message: "Success!",
          roles:user.roles
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }
};
exports.getuser = (req, res) => {
  if (!req.body.id) {
    res.status(500).send({ message: "Can't find!" });
  } else {
    User.findByPk(req.body.userId)
      .then((user) => {
        if (!user) {
          res.status(500).send({ message: "User not found!" });
        }
        res.status(200).send({
          message: "Success!",
          id: user.id,
          username: user.username,
          email:user.email,
          verify:user.verify
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }
};
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

// Example getPagingData function
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, users, totalPages, currentPage };
};

exports.getAllUser = async (req, res) => {
  try {
    const { id, page, size } = req.query;
    var condition = id ? { id: id } : null;
    const { limit, offset } = getPagination(page, size);

    const data = await User.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']], 
    });

    const response = getPagingData(data, page, limit);
    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};
exports.getuserbyid=(req,res)=>{
  User.findByPk(req.query.userId)
  .then((user) => {
    if (!user) {
      res.status(500).send({ message: "User not found!" });
    }
    res.status(200).send({
      message: "Success!",
      user:user
    });
  })
  .catch((err) => {
    res.status(500).send({ message: err.message });
  });
}
exports.getstatus=(req,res)=>{
  User.findByPk(req.query.userId)
  .then((user) => {
    if (!user) {
      res.status(500).send({ message: "User not found!" });
    }
    res.status(200).send({
      message: "Success!",
      status:user.active
    });
  })
  .catch((err) => {
    res.status(500).send({ message: err.message });
  });
}