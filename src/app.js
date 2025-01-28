const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const authRoutes = require('./routes/authRoutes');
const routes = require('./routes/dbRoutes/routes');
const fileRoutes = require('./routes/fileRoutes');
const { connectRedis } = require('./utils/cacheUtils');
const { metricsMiddleware, register } = require('./utils/metrics');


const app = express();
dotenv.config();
connectRedis();

app.use(express.json());
app.use(bodyParser.json());
app.use(metricsMiddleware);
app.use('/api/files', fileRoutes);
app.use('/api/auth', authRoutes);
app.use(routes);


exec('npx sequelize-cli db:migrate', (err, stdout, stderr) => {
    if (err) {
        console.error(`Error doing migrations: ${err.message}`);
        return;
    }

    if (stderr) {
        console.error(`stderr: ${stderr}`);
    }

    console.log(`stdout: ${stdout}`);
});

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
    res.send(`Memory load completed with ${iterations} iterations.`);
});

app.get('/', (req, res) => {
    const randomStatusCode = Math.floor(Math.random() * 400) + 200;
    res.status(randomStatusCode).send(`Response with status code: ${randomStatusCode}`);
});

module.exports = app;