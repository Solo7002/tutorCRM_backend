const express = require('express');
const client = require('prom-client');

const app = express();

const METRICS_PORT = process.env.METRICS_PORT;

const restResponseTimeHistogram = new client.Histogram({
    name: 'rest_responce_time_duration_seconds',
    help: 'REST API response time in seconds',
    labelNames: ['method', 'route', 'status_code']
});

const databaseResponceTimeHistogram = new client.Histogram({
    name: 'db_responce_time_duration_seconds',
    help: 'Database response time in seconds',
    labelNames: ['operation', 'success']
});

function runMetricsServer(){
    const collectDefaultMetrics = client.collectDefaultMetrics;

    collectDefaultMetrics();

    app.get('/metrics', async (req, res) => {
        res.set("Content-Type", client.register.contentType);
        
        return res.send(await client.register.metrics());
    });

    app.listen(METRICS_PORT, () => {
        console.log(`Metrics server runnig at http://localhost:${METRICS_PORT}/metrics`);
    });
}

module.exports = {runMetricsServer, restResponseTimeHistogram, databaseResponceTimeHistogram};