const env = require('dotenv');
const path = require('path');
const nodemailer = require("nodemailer");

env.config({ path: path.resolve(__dirname, '../config.env') }); 

if (!process.env.SENDGRID_API_KEY) {
  throw new Error(".env variable SENDGRID_API_KEY is missing!");
}

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",                   // literally "apikey"
    pass: process.env.SENDGRID_API_KEY,
  },
});

const sendOrderConfirmation = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Teabuff Store" <${process.env.EMAIL_USER}>`, // verified in SendGrid
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
