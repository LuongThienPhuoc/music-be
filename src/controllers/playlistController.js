const Playlist = require("../models/playlist")
const { ZingMp3 } = require("zingmp3-api-full")

class playlistController {
  async getDetailPlaylist(req, res) {
    const { id } = req.params
    ZingMp3.getDetailPlaylist(id)
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((err) => {
        res.status(400).json({
          message: err.message
        })
      })
  }

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
    try {
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
    } catch (err) {
      res.status(400).json({
        message: "Thêm thất bại",
        playlists: err.message
      })
    }
  }

  async updatePlaylist(req, res) {
    try {
      const { songs, username, playlistId } = req.body
      Playlist.findByIdAndUpdate(
        {
          _id: playlistId
        },
        {
          songs
        }
      )
        .then((result) => {
          res.status(200).json({
            message: "Update thành công",
            playlists: result
          })
        })
        .catch((err) => {
          res.status(400).json({
            err: err.message
          })
        })
    } catch (err) {
      res.status(400).json({
        err: err.message
      })
    }
  }

  async updateNamePlaylist(req, res) {
    try {
      const { id, playlistName, username } = req.body
      const currentPlaylist = await Playlist.findById(id)
      const idCheck = await Playlist.findOne({ playlistName, username })
      if (idCheck && currentPlaylist.playlistName !== idCheck.playlistName) {
        res.status(400).json({
          message: "Tên tồn tại"
        })
      } else {
        Playlist.findByIdAndUpdate(id, {
          playlistName
        })
          .then((result) => {
            res.status(200).json({
              message: "Đổi tên thành công"
            })
          })
          .catch((err) => {
            res.status(400).json({
              message: err.message
            })
          })
      }
    } catch (err) {
      res.status(400).json({
        message: err.message
      })
    }
  }
}

module.exports = new playlistController()
