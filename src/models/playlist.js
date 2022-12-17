const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PlaylistSchema = new Schema(
    {
        username: { type: String, require },
        playlistName: { type: String, require },
        songs: { type: Array, default: [] }
    },
    { timestamps: true }
)

const Playlist = mongoose.model("playlists", PlaylistSchema)
module.exports = Playlist
