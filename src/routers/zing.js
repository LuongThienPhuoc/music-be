const express = require("express")
const router = express.Router()

const zingController = require("../controllers/zingController")
router.get("/get-top-100", zingController.getTop100)
router.get("/get-concrete-lyric", zingController.getConcreteLyric)
router.get("/get-top-and-stream", zingController.getListLink)
router.get("/get-random", zingController.getRandomSongList)

module.exports = router
