require('dotenv').config();
const http = require('http');
const app = require('./app');

const PORT = process.env.PORT;

const server = http.createServer(app);

require('./workers/emailWorker.js'); 

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});