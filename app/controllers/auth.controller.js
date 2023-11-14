const db = require("../models");
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");

const signin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const accessToken = jwt.sign({ password }, config.secret, {
    expiresIn: 3600 // 1 hour
  });
  res.json({
    username: username,
    accessToken: accessToken
  });
}

const signup = (req, res) => { }

module.exports = {
    signin,
    signup
}