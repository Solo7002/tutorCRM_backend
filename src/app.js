const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const routes = require('./routes/dbRoutes/routes');
const fileRoutes = require('./routes/fileRoutes');
const { connectRedis } = require('./utils/cacheUtils');
const { metricsMiddleware, register } = require('./utils/metrics');

const { populateDatabase } = require('./services/fillDataForTests');

require('./config/passportConfig');


const app = express();
dotenv.config();
connectRedis();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(metricsMiddleware);
app.use('/api/files', fileRoutes);
app.use('/api/auth', authRoutes);
app.use(routes);

const path = require("path");
const options = {
    definition: {
        openapi: '3.0.0',
        info: { title: "Node JS API Project", version: '1.0.1' },
        servers: [{ url: "http://localhost:4000/" }]
    },
    apis: [
        path.join(__dirname, "./app.js"),
        path.join(__dirname, "./routes/**/*.js"),
        path.join(__dirname, "./routes/fileRoutes.js"),
        path.join(__dirname, "./routes/authRoutes.js") 
    ]
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.get('/populate', async (req, res) => {
    try {
      await populateDatabase();
      res.send('База даних успішно заповнена');
    } catch (error) {
      console.error(error);
      res.status(500).send('Помилка при заповненні бази даних');
    }
  });

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Returns application metrics
 *     responses:
 *       200:
 *         description: A list of metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: string
 */
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
});

/**
 * @swagger
 * /cpu-load:
 *   get:
 *     summary: Simulate CPU load
 *     parameters:
 *       - in: query
 *         name: iterations
 *         schema:
 *           type: integer
 *           default: 1000000
 *         description: Number of iterations to simulate CPU load
 *     responses:
 *       200:
 *         description: Result of CPU load simulation
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
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

/**
 * @swagger
 * /memory-load:
 *   get:
 *     summary: Simulate memory load
 *     parameters:
 *       - in: query
 *         name: iterations
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of iterations to simulate memory load
 *     responses:
 *       200:
 *         description: Result of memory load simulation
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get('/memory-load', (req, res) => {
    const iterations = parseInt(req.query.iterations) || 100;
    const memoryHog = [];
    for (let i = 0; i < iterations; i++) {
        const largeString = 'x'.repeat(1024 * 1024);
        memoryHog.push(largeString);
    }
    res.send(`Memory load completed with ${iterations} iterations.`);
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get a random status code response
 *     responses:
 *       200:
 *         description: Random status code response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get('/', (req, res) => {
    const randomStatusCode = Math.floor(Math.random() * 100) + 200;
    res.status(randomStatusCode).send(`Response with status code: ${randomStatusCode}`);
});

module.exports = app;