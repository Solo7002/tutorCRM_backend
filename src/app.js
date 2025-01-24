const express = require('express');

const app = express();
const fileRoutes = require('./routes/fileRoutes');

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(express.json());

app.use('/api/files', fileRoutes);

module.exports = app;