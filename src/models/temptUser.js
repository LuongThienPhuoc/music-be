const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TemptUserSchema = new Schema(
  {
    username: { type: String },
    email: { type: String },
    otp: { type: String }
  },
  { timestamps: true }
)

const TemptUser = mongoose.model("temptUser", TemptUserSchema)
TemptUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 })
module.exports = TemptUser
