const checkValidEmail = require("../helper/emailValid")
const TemptUser = require("../models/temptUser.js")
const User = require("../models/users.js")
const bcrypt = require("bcrypt")
const { JWTAuthToken } = require("../middleware/JWT")
// const ZingMP3 = require("zingmp3-api")
const { ZingMp3 } = require("zingmp3-api-full")
const SALT_ROUND = 10
const sendMailNode = require("../helper/sendMail")

function makeCode(length) {
  var result = ""
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

class userController {
  test = async (req, res) => {
    // const song = await ZingMp3.getSong("IWZAEC86")
    // const sontung = await ZingMp3.getArtist("sontungmtp")
    // res.status(200).json({
    //   song,
    //   sontung
    // })
    const data = await ZingMp3.getChartHome()
    res.status(200).send({ success: true, data: data })
  }

  top10 = async (req, res) => {
    const top10 = await ZingMp3.getTop100()
    res.status(200).json(top10)
  }

  signUp = async (req, res) => {
    const { username, email, name, password } = req.body
    // Check valid username and email
    const userExist = await User.findOne({
      $or: [{ username: username }, { email: email }]
    })
    if (userExist) {
      let errorMessage = ""
      if (userExist.username === username) {
        errorMessage = `Tên đăng nhập: ${username} đã được sử dụng, vui lòng sử dụng tên khác`
      } else {
        errorMessage = `Email ${email} đã được sử dụng, vui lòng sử dụng email khác`
      }
      res.status(200).send({ success: false, errorMessage: errorMessage })
      return
    } else {
      User.create({
        username: username,
        password: bcrypt.hashSync(password, SALT_ROUND),
        email: email,
        fullName: name
      })
      res
        .status(200)
        .send({ success: true, info: { username, email, name, password } })
    }
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

    const sendMail = (code) => {
      if (checkValidEmail(email)) {
        sendMailNode("P2Tunes Login Code", `Login Code was: ${code}`, email)
      }
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
      try {
        const code = makeCode(6)
        sendMail(code)
        TemptUser.create({
          email: email,
          otp: code
        })
          .then((data) => {
            // console.log("data", data)
            nextFunction()
          })
          .catch((err) => {
            errorFunction()
          })
      } catch (e) {
        errorFunction()
      }
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
    const signJWT = JWTAuthToken([username])
    const successFunction = (message, data) => {
      res.status(200).send({
        success: true,
        jwt: signJWT,
        message: message,
        data
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
            successFunction("Login successfully", data)
          }
        })
        .catch((err) => {
          errorFuncion(err.message)
        })
    }

    findUser(username, password)
  }

  refresh = async (req, res) => {
    const username = res.locals.data["0"]
    const data = await User.findOne({ username })
    if (data === null) {
      res.status(200).send({
        success: false,
        message: "Not found username"
      })
    } else
      res.status(200).send({
        success: true,
        message: "Refresh successfully",
        username,
        data
      })
  }

  changeProfile = async (req, res) => {
    User.findOneAndUpdate(
      { username: req.body.username },
      { ...req.body },
      { new: true }
    )
      .then((data) => {
        res.status(200).send({
          success: true,
          data: data
        })
      })
      .catch((err) => {
        res.status(200).send({
          success: false
        })
      })

    // const username = res.locals.data["0"]
    // const data = await User.findOne({ username })
    // if (data === null) {
    //   res.status(200).send({
    //     success: false,
    //     message: "Not found username"
    //   })
    // } else
    //   res.status(200).send({
    //     success: true,
    //     message: "Refresh successfully",
    //     username,
    //     data
    //   })
  }
}

module.exports = new userController()
