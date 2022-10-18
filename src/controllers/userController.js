const checkValidEmail = require("../helper/emailValid")
const sendMail = require("../helper/sendMail")
const crypto = require("crypto")
const TemptUser = require("../models/temptUser.js")
const User = require("../models/users.js")
const bcrypt = require("bcrypt")

const SALT_ROUND = 10

class userController {
  signUp = (req, res) => {
    const { username, email, name, password } = req.body
    User.create({
      username: username,
      password: bcrypt.hashSync(password, SALT_ROUND),
      email: email,
      fullName: name
    })
    res.status(200).send({ username, email, name, password })
  }

  requestOTP = (req, res) => {
    // console.log("req.body", req.body)
    const { email, username } = req.body
    TemptUser.create({
      email: email,
      username: username,
      otp: crypto.randomBytes(4).toString("hex")
    })
      .save()
      .then((data) => {})
      .catch((err) => {})
    if (checkValidEmail(email)) {
      // sendMail("P2Tunes Login Code", "Login Code was: 123", email)
    }
    res.status(200).send({ success: true })
  }
}

module.exports = new userController()
