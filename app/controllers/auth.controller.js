const db = require("../models");
const config = require("../config/auth.config");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = db.user;

const signin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // User.findOne({
  //   where: {
  //     username: username,
  //   },
  // })
  //   .then((user) => {
  //     if (!user) {
  //       return res.status(404).send({ message: "User Not found." });
  //     }

  //     const passwordIsValid = bcrypt.compareSync(password, user.password);

  //     if (!passwordIsValid) {
  //       return res.status(401).send({
  //         accessToken: null,
  //         message: "Invalid Password!",
  //       });
  //     }

  //     const accessToken = jwt.sign({ password }, config.secret, {
  //       expiresIn: 3600, // 1 hour
  //     });

  //     res.status(200).send({
  //       id: user.id,
  //       username: user.username,
  //       accessToken: accessToken,
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({ message: err.message });
  //   });

  User.create({
    username: username,
    password: password,
    email: "abs@gmail.com",
    createdat: new Date(Date.now()).toISOString(),
    updatedat: new Date(Date.now()).toISOString(),
  })
    .then((user) => {
      res.send({ message: "User was registered successfully!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const signup = (req, res) => {};

module.exports = {
  signin,
  signup,
};
