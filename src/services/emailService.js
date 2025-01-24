const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
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

/**
 * Рендеринг HTML-шаблонов с использованием переменных
 * @param {string} templateName - Имя файла шаблона (без расширения)
 * @param {Object} variables - Переменные для замены в шаблоне
 * @returns {Promise<string>} - Отрендеренный HTML
 */
async function renderTemplate(templateName, variables) {
  const templatePath = path.join('./src/templates', `${templateName}.html`);
  try {
    let content = await fs.readFile(templatePath, 'utf-8');
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(placeholder, value);
    }
    return content;
  } catch (error) {
    console.error(`Ошибка при рендеринге шаблона ${templateName}:`, error.message);
    throw error;
  }
}

/**
 * Отправка письма
 * @param {string} to - Email получателя
 * @param {string} subject - Тема письма
 * @param {string} text - Текстовое содержимое (опционально)
 * @param {string|null} html - HTML содержимое письма (опционально)
 */
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

/**
 * Отправка письма о регистрации
 * @param {string} email - Email получателя
 * @param {string} username - Имя пользователя
 * @param {string} activationLink - Ссылка для активации аккаунта
 */
async function sendRegistrationEmail(email, username, activationLink) {
  const htmlContent = await renderTemplate('registration', { username, link: activationLink });
  await sendEmail(email, 'Регистрация завершена', 'Спасибо за регистрацию!', htmlContent);
}

/**
 * Отправка письма о сбросе пароля
 * @param {string} email - Email получателя
 * @param {string} username - Имя пользователя
 * @param {string} resetLink - Ссылка для сброса пароля
 */
async function sendResetPasswordEmail(email, username, resetLink) {
  const htmlContent = await renderTemplate('reset_password', { username, link: resetLink });
  await sendEmail(email, 'Сброс пароля', 'Инструкции по сбросу пароля', htmlContent);
}

/**
 * Отправка письма о сбросе пароля
 * @param {string} email - Email получателя
 * @param {string} username - Имя пользователя
 * @param {string} cancelLink - Ссылка для отмены
 */
async function sendLoginEmail(email, username, cancelLink) {
  const htmlContent = await renderTemplate('login', { username, link: cancelLink });
  await sendEmail(email, 'Новый вход', 'Был совершен новый вход', htmlContent);
}

module.exports = {
  sendEmail,
  sendRegistrationEmail,
  sendResetPasswordEmail,
  sendLoginEmail,
};
