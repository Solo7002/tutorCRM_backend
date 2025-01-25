const express = require('express');
const app = express();
const { metricsMiddleware, register } = require('./utils/metrics');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const routes = require('./routes/dbRoutes/routes');
const fileRoutes = require('./routes/fileRoutes');

dotenv.config();

app.use(express.json());

app.use('/api/files', fileRoutes);
app.use(metricsMiddleware);
app.use(routes);
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-type', register.contentType);
    res.end(await register.metrics());
});

app.get('/cpu-load', (req, res) => {
    const iterations = parseInt(req.query.iterations) || 1000000;
    let heads = 0;
    let tails = 0;

    for (let i = 0; i < iterations; i++) {
        const flip = Math.random() < 0.5 ? 'heads' : 'tails';
        if (flip === 'heads') {
            heads++;
        } else {
            tails++;
        }
    }

    res.send(`Heads: ${heads}, Tails: ${tails}`);
});

app.get('/memory-load', (req, res) => {
    const iterations = parseInt(req.query.iterations) || 100;
    const memoryHog = [];

    for (let i = 0; i < iterations; i++) {
        const largeString = 'x'.repeat(1024 * 1024);
        memoryHog.push(largeString);
    }

const app = express();
const fileRoutes = require('./routes/fileRoutes');
    res.send(`Memory load completed with ${iterations} iterations.`);
});

app.get('/', (req, res) => {
    const randomStatusCode = Math.floor(Math.random() * 400) + 200;
    res.status(randomStatusCode).send(`Response with status code: ${randomStatusCode}`);
});

module.exports = app;