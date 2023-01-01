const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    username: { type: String, unique: true },
    password: { type: String },
    email: { type: String, unique: true },
    fullName: { type: String },
    verify: { type: Boolean, default: false },
    avatarUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }
  },
  { timestamps: true }
)

const User = mongoose.model("users", UserSchema)
module.exports = User
