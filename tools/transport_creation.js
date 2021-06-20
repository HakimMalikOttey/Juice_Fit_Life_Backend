const nodemailer = require("nodemailer");
require('dotenv').config();
module.exports = {
  transportcreation: function transportcreation(){
    // create reusable transporter object using the default SMTP transport
    return nodemailer.createTransport({

      host: "smtp.gmail.com",
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: `${process.env.EMAIL}`, // generated ethereal user
        pass: `${process.env.EMAIL_PASS}`, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
}
