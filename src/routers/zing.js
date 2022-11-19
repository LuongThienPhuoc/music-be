const express = require("express")
const router = express.Router()

const zingController = require("../controllers/zingController")
router.get("/get-top-100", zingController.getTop100)

module.exports = router
