const env = require('dotenv')
const path = require('path')
const nodemailer = require("nodemailer");

env.config({ path: path.resolve(__dirname, '../config.env') }); 

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error(".env variables EMAIL_USER or EMAIL_PASS are missing!");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // must be an App Password, not your Gmail login
  },
});

/*const transporter = nodemailer.createTransport({
  service: "gmail", // or any SMTP service
  auth: {
    user: process.env.EMAIL_USER,      // your email
    pass: process.env.EMAIL_PASS,      // app password for Gmail
  },

});*/

const sendOrderConfirmation = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Teabuff Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log("Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
};

module.exports = { sendOrderConfirmation };
