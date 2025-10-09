const { sendContactMessage } = require("../utils/sendEmail");

exports.ContactMail = async (req, res) => {
  const { username, email, subject, message } = req.body;

  if (!username || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sent = await sendContactMessage(username, email, subject, message);
  if (sent) {
    return res.status(200).json({ message: "Message sent successfully!" });
  } else {
    return res.status(500).json({ error: "Failed to send message" });
  }
};