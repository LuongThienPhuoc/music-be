const Playlist = require("../models/playlist")
class playlistController {
  async deletePlaylist(req, res) {
    const { username, playlistName } = req.body
    Playlist.findOneAndDelete({ username, playlistName })
      .then((result) => {
        res.status(200).json({ message: "Delete success" })
      })
      .catch((err) => {
        res.status(400).json({ message: "Delete failed" })
      })
  }

  async createPlaylist(req, res) {
    const { username, playlistName } = req.body
    const isCheck = await Playlist.findOne({ username, playlistName })
    if (isCheck) {
      res.status(400).json({
        message: "Playlist already exist"
      })
    } else {
      const playlist = new Playlist({
        username,
        playlistName
      })
      await playlist.save()
      res.status(200).json({
        message: "Thêm thành công",
        playlist
      })
    }
  }

  async getAllPlaylist(req, res) {
    const { id } = req.params
    const result = await Playlist.find({ username: id })
    res.status(200).json({
      message: "Lấy toàn bộ thành công",
      playlists: result
    })
  }

  async addSong(req, res) {
    const { songs, username, playlistName } = req.body
    const result = await Playlist.findOneAndUpdate(
      {
        username,
        playlistName
      },
      {
        songs
      }
    )
    res.status(200).json({
      message: "Lấy toàn bộ thành công",
      playlists: result
    })
  }

  async updatePlaylist(req, res) {
    try {
      const { songs, username, playlistId } = req.body
      const result = await Playlist.findOneAndUpdate(
        {
          _id: playlistId,
          username
        },
        {
          songs
        }
      )
      res.status(200).json({
        message: "Update thành công",
        playlists: result
      })
    } catch (err) {
      res.status(400).json({
        err: err.message
      })
    }
  }
}

module.exports = new playlistController()
