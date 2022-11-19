const userRoute = require("./user")
const zingRoute = require("./zing")

function route(app) {
  // app.use("/", (req, res) => { res.send("ABC") })
  app.use("/api/v1/user", userRoute)
  app.use("/api/v1/zing", zingRoute)
}

module.exports = route
