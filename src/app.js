const express = require('express');
const { runMetricsServer, restResponseTimeHistogram } = require('./utils/metrics');
const responceTime = require('response-time');

const app = express();

app.use(responceTime((req, res, time) => {
    restResponseTimeHistogram.observe({
        method: req.method,
        route: 'route',
        status_code: res.statusCode
    }, time);
}));

app.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = app;