const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();


app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = app;