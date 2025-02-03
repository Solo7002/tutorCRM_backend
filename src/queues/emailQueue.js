const amqp = require('amqplib');
const logger = require('../utils/logger');

const QUEUE_NAME = 'emailQueue';

/**
 * Отправка задачи в очередь RabbitMQ
 * @param {Object} emailData - Данные письма (to, subject, text, html)
 */
async function sendToQueue(emailData) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(emailData)), {
      persistent: true, // Сообщения сохраняются при перезапуске сервера
    });

    logger.info(`Email отправлен в очередь: ${emailData.to}`);
    await channel.close();
    await connection.close();
  } catch (error) {
    logger.error(`Ошибка отправки в RabbitMQ: ${error.message}`);
  }
}

module.exports = sendToQueue;
