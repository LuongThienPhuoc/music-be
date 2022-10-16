const userRoute = require("./user")

function route(app) {
  // app.use("/", (req, res) => { res.send("ABC") })
  app.use("/api/v1/user", userRoute)
}

module.exports = route
