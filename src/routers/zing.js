const express = require("express")
const router = express.Router()

const zingController = require("../controllers/zingController")

router.get("/get-song-by-id", zingController.getSongById)
router.get("/get-singer-by-id", zingController.getSingerById)
router.get("/get-random-song-list", zingController.getRandomSongList)
router.get("/get-detail-song", zingController.getDetailSong)
router.get("/search", zingController.search)
router.get("/get-top-100", zingController.getTop100)
router.get("/get-concrete-lyric", zingController.getConcreteLyric)
router.get("/get-top-and-stream", zingController.getListLink)
router.get("/get-list-music", zingController.getListMusic)
router.get("/get-random", zingController.getRandomSongList)
router.get("/get-radio", zingController.getRadio)

module.exports = router
