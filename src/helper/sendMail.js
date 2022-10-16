const nodemailer = require("nodemailer")

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "phiroudnodemailer@gmail.com",
    pass: "yrrtytdsnrsyyrhc"
  }
})

const sendMail = (subject, content, receiver) => {
  var mailOptions = {
    from: "phiroudnodemailer@gmail.com",
    to: receiver,
    subject: subject,
    text: content
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw Error(`Can't send mail. Err: ${err.message}`)
    } else {
      console.log("Email sent: " + info.response)
    }
  })
}

module.exports = sendMail
