require("dotenv").config()
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const route = require("./src/routers/index")
const connectDB = require("./src/config/configDb")

const PORT = process.env.PORT || 5050

app.use(bodyParser.json({ limit: 10000 }))
app.use(bodyParser.urlencoded({ extended: true, limit: 10000 }))

// app.head("/", cors(), (req, res) => {
//   // console.info("HEAD /simple-cors");
//   res.sendStatus(204)
// })

app.use(
  cors({
    credentials: true,
    origin: true
  })
)
app.use(cookieParser())
app.use(express.static("public"))
connectDB()
route(app)

app.listen(PORT, () => {
  console.log("Server is running at port " + PORT)
  console.log("Re deploy at 6h44 6/11")
})
