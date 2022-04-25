const nodemailer = require('nodemailer')
const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.Admin_email,
        pass: process.env.Admin_pass,
      },
    })

    await transporter.sendMail({
      from: process.env.Admin_email,
      to: email,
      subject: subject,
      html: html,
    })
    console.log('email sent successfully')
  } catch (error) {
    console.log('email not sent')
    console.log(error)
  }
}

module.exports = sendEmail
