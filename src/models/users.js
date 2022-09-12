const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        email: {
            type: String,
        },
        pass: {
            type: String,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("usersMusic", UserSchema);
module.exports = User;
