const checkValidEmail = require("../helper/emailValid")
const sendMail = require("../helper/sendMail")
const crypto = require("crypto")
const TemptUser = require("../models/temptUser.js")
const User = require("../models/users.js")
const bcrypt = require("bcrypt")
const { JWTAuthToken } = require("../middleware/JWT")

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
    const { email } = req.body
    const errorFunction = () => {
      res.status(200).send({
        success: false,
        message: "User not found"
      })
      return
    }

    const isRequestingOTP = (trueFunction, falseFunction) => {
      TemptUser.findOne({ email: email })
        .then((data) => {
          if (data.length === 0) {
            falseFunction()
          } else trueFunction()
        })
        .catch((err) => falseFunction())
    }

    const createTepmtUser = (email, nextFunction) => {
      TemptUser.create({
        email: email,
        otp: 12345
      })
        .then((data) => {
          // console.log("data", data)
          nextFunction()
        })
        .catch((err) => {
          errorFunction()
        })
    }

    const findUser = (nextFunction) => {
      User.find({ email: email })
        .then((data) => {
          // console.log("data", data)
          if (data.length === 0) {
            throw Error()
          }
          nextFunction()
        })
        .catch((err) => {
          // console.log("err", err)
          errorFunction()
        })
    }

    const sendMail = () => {
      if (checkValidEmail(email)) {
        sendMail("P2Tunes Login Code", "Login Code was: 123", email)
      }
    }

    // Chain
    isRequestingOTP(
      () => {
        res.status(200).send({
          success: false,
          message: "Request otp of your account reach limit"
        })
        return
      },
      () => {
        findUser(() =>
          createTepmtUser(email, () => {
            res.status(200).send({ success: true })
          })
        )
      }
    )
  }

  verifyOTP = (req, res) => {
    const { email, code } = req.body
    const successFunction = () => {
      res.status(200).send({
        success: true,
        message: "Success verifing your account"
      })
      return
    }

    const errorFunction = (message) => {
      res.status(200).send({
        success: false,
        message: message
      })
      return
    }
    const verifyTemptUser = (trueFunction, falseFunction) => {
      TemptUser.find({ email: email, otp: code })
        .then((data) => {
          if (data.length === 0) {
            falseFunction()
          } else {
            trueFunction()
          }
        })
        .catch((err) => {
          falseFunction()
        })
    }

    const setStatusVerifiedUser = (email) => {
      User.findOneAndUpdate(
        { email: email },
        {
          verify: true
        }
      )
        .then((data) => {
          successFunction()
        })
        .catch((err) => {
          errorFunction("Can't set your verified status")
        })
    }

    verifyTemptUser(
      () => {
        setStatusVerifiedUser(email)
      },
      () => {
        errorFunction("OTP incorrect, expired or email not found")
      }
    )
  }

  login = (req, res) => {
    const { username, password } = req.body
    const signJWT = JWTAuthToken(username)
    const successFunction = (message) => {
      res.status(200).send({
        success: true,
        jwt: signJWT,
        message: message
      })
      return
    }
    const errorFuncion = (message) => {
      res.status(200).send({
        success: false,
        message: message
      })
      return
    }
    const findUser = (username, password) => {
      User.findOne({ username: username })
        .then((data) => {
          if (data === null) {
            errorFuncion("User not found")
          } else if (!data.verify) {
            errorFuncion("You account is not verified")
          } else if (!bcrypt.compareSync(password, data.password)) {
            errorFuncion("Password incorrect")
          } else {
            successFunction("Login successfully")
          }
        })
        .catch((err) => {
          errorFuncion(err.message)
        })
    }

    findUser(username, password)
  }

  refresh = (req, res) => {
    const username = res.locals.data[0]
    res.status(200).send({
      success: true,
      message: "Refresh successfully",
      username
    })
  }
}

module.exports = new userController()
