const { createLogger, format, transports } = require('winston');
const path = require('path');

const logsDirectory = path.join(__dirname, '../../logs');

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
);

const logger = createLogger({
  level: 'info', // Уровень логирования (error, warn, info, verbose, debug, silly)
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(logsDirectory, 'integrations.log'),
      level: 'info',
    }),
  ],
});

module.exports = logger;
