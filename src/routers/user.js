const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

router.post("/request-otp", userController.requestOTP)
router.post("/sign-up", userController.signUp)

module.exports = router
