const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const sendToQueue = require('../queues/emailQueue');

require('dotenv').config();

const BREVO_SMTP_KEY = process.env.BREVO_API_KEY;
const BREVO_SMTP_USER = process.env.BREVO_API_USER;
const EMAIL_FROM = process.env.SMTP_EMAIL_FROM;

if (!BREVO_SMTP_KEY) {
  const errorMessage = "Brevo API Key is not configured.";
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: BREVO_SMTP_USER,
    pass: BREVO_SMTP_KEY,
  },
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
    logger.error(`Ошибка при рендеринге шаблона ${templateName}: ${error.message}`);
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
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
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

  const emailData = {
    to: email,
    subject: 'Регистрация завершена',
    text: 'Спасибо за регистрацию!',
    html: htmlContent,
  };

  //await sendToQueue(emailData);
  await sendEmail(emailData.to, emailData.subject, emailData.text, emailData.html); 
}


/**
 * Отправка письма о сбросе пароля
 * @param {string} email - Email получателя
 * @param {string} username - Имя пользователя
 * @param {string} resetLink - Ссылка для сброса пароля
 */
async function sendResetPasswordEmail(email, username, resetLink) {
  try {
    const htmlContent = await renderTemplate('reset_password', { username, link: resetLink });
    const emailData = {
      to: email,
      subject: 'Сброс пароля',
      text: 'Инструкции по сбросу пароля',
      html: htmlContent,
    };
  
    //await sendToQueue(emailData); 
    await sendEmail(emailData.to, emailData.subject, emailData.text, emailData.html); 
  } catch (error) {
    logger.error(`Ошибка отправки письма сброса пароля на почту ${email}: ${error.message}`);
    throw error;
  }
}

/**
 * Отправка письма о входе
 * @param {string} email - Email получателя
 * @param {string} username - Имя пользователя
 * @param {string} cancelLink - Ссылка для отмены
 */
async function sendLoginEmail(email, username, cancelLink) {
  try {
    const htmlContent = await renderTemplate('login', { username, link: cancelLink });
    const emailData = {
      to: email,
      subject: 'Новый вход',
      text: 'Был совершен новый вход',
      html: htmlContent,
    };
  
    //await sendToQueue(emailData); 
    await sendEmail(emailData.to, emailData.subject, emailData.text, emailData.html); 
  } catch (error) {
    logger.error(`Ошибка отправки уведомления о входе на почту ${email}: ${error.message}`);
    throw error;
  }
}

/**
 * Отправка письма с кодом подтверждения email
 * @param {string} email - Email получателя
 * @param {string} username - Имя пользователя
 * @param {string} code - Код подтверждения
 */
const sendVerificationCode = async (email, username, code) => {
  try {
    const formattedCode = code.split("").map((char, index) => (index === 3 ? " " + char : char)).join(" ");
    const htmlContent = await renderTemplate('verification_code', { username, formattedCode });

    const emailData = {
      to: email,
      subject: 'Підтвердження email',
      text: `Підтвердження email для реєстрації в додатку TUTOCT`,
      html: htmlContent,
    };

    await sendEmail(emailData.to, emailData.subject, emailData.text, emailData.html);
  } catch (error) {
    logger.error(`Ошибка отправки кода подтверждения на почту ${email}: ${error.message}`);
    throw error;
  }
};

async function sendResetPasswordWithNewEmail(email, username, newPassword) {
  try {
    const htmlContent = await renderTemplate('reset_password_with_new', { username, newPassword });
    const emailData = {
      to: email,
      subject: 'Зміна пароля',
      text: 'Ваш новий пароль',
      html: htmlContent,
    };
    await sendEmail(emailData.to, emailData.subject, emailData.text, emailData.html);
  } catch (error) {
    logger.error(`Ошибка отправки нового пароля на почту ${email}: ${error.message}`);
    throw error;
  }
}

module.exports = {
  sendEmail,
  sendRegistrationEmail,
  sendResetPasswordEmail,
  sendLoginEmail,
  sendVerificationCode,
  sendResetPasswordWithNewEmail
};
