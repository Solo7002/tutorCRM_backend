const amqp = require('amqplib');
const { sendEmail } = require('../services/emailService');
const logger = require('../utils/logger');

const QUEUE_NAME = 'emailQueue';

async function startEmailWorker() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    logger.info('Email Worker запущен и слушает очередь...');

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const emailData = JSON.parse(msg.content.toString());

        try {
          await sendEmail(emailData.to, emailData.subject, emailData.text, emailData.html);
          logger.info(`Email отправлен: ${emailData.to}`);
          channel.ack(msg); // Подтверждаем обработку
        } catch (error) {
          logger.error(`Ошибка отправки email: ${error.message}`);
          channel.nack(msg); // Вернуть сообщение в очередь
        }
      }
    }, { noAck: false });
  } catch (error) {
    logger.error(`Ошибка запуска Email Worker: ${error.message}`);
  }
}

startEmailWorker();
