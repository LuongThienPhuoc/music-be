const userRoute = require("./user")
const zingRoute = require("./zing")
const playlistRoute = require("./playlist")

function route(app) {
  // app.use("/", (req, res) => { res.send("ABC") })
  app.use("/api/v1/user", userRoute)
  app.use("/api/v1/zing", zingRoute)
  app.use("/api/v1/playlist", playlistRoute)
}

module.exports = route
