const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { AuthMiddleware } = require("../middleware/JWT")

router.get("/top10", userController.top10)
router.get("/test", userController.test)
router.post("/request-otp", userController.requestOTP)
router.post("/sign-up", userController.signUp)
router.post("/verify-otp", userController.verifyOTP)
router.post("/sign-in", userController.login)
router.get("/refresh", AuthMiddleware, userController.refresh)
router.post("/change-profile", userController.changeProfile)

module.exports = router
