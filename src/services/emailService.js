const nodemailer = require('nodemailer');
require('dotenv').config();

const BREVO_SMTP_KEY = process.env.BREVO_API_KEY;
const BREVO_SMTP_USER = process.env.BREVO_API_USER;
const EMAIL_FROM = process.env.SMTP_EMAIL_FROM;

if (!BREVO_SMTP_KEY) {
  throw new Error("Brevo API Key is not configured.");
}

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: BREVO_SMTP_USER,
    pass: BREVO_SMTP_KEY,
  },
  logger: true, // Включение логирования
  debug: true,  // Включение отладки
});

async function sendEmail(to, subject, text, html = null) {
  const mailOptions = {
    from: EMAIL_FROM,
    to: to,
    subject: subject,
    text: text,
    ...(html && { html }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error('Failed to send email:', error.message);
  }
}

module.exports = { sendEmail };