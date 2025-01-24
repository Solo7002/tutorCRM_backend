const express = require('express');
const app = express();

const routes = require('./routes/routes');
app.use(routes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = app;