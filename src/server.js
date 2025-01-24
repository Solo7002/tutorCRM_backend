require('dotenv').config();
const http = require('http');
const app = require('./app');

const PORT = process.env.PORT;

const server = http.createServer(app);

const { sendRegistrationEmail } = require('./services/emailService');
/*
sendRegistrationEmail(
  'nikitasiskov737@gmail.com',
  'Nikita',
  'https://example.com/activate?token=abc123'
).then(() => console.log('Письмо о регистрации отправлено'))
  .catch(err => console.error('Ошибка при отправке письма о регистрации:', err));*/

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});