const env = require('dotenv');
const path = require('path');
const sgMail = require('@sendgrid/mail');

env.config({ path: path.resolve(__dirname, '../config.env') });

if (!process.env.SENDGRID_API_KEY) {
  throw new Error(".env variable SENDGRID_API_KEY is missing!");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOrderConfirmation = async (to, subject, text) => {
  try {
    const msg = {
      to, // recipient email
      from: `"Teabuff Store" <${process.env.EMAIL_USER}>`, // verified in SendGrid
      subject,
      text,
    };
    const response = await sgMail.send(msg);
    console.log("Email sent:", response[0].statusCode);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
};

module.exports = { sendOrderConfirmation };
