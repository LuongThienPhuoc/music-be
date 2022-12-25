const express = require("express")
const router = express.Router()
const playlistController = require("../controllers/playlistController")

router.post("/update-playlist", playlistController.updatePlaylist)
router.post("/add-song", playlistController.addSong)
router.post("/", playlistController.createPlaylist)
router.get("/:id", playlistController.getAllPlaylist)

module.exports = router
