const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require('cors');
const cron = require('node-cron')
const{deleteOldFiles}=require('./services/cleanupService');


const authRoutes = require('./routes/authRoutes');
const routes = require('./routes/dbRoutes/routes');
const fileRoutes = require('./routes/fileRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { connectRedis } = require('./utils/cacheUtils');
const { metricsMiddleware, register } = require('./utils/metrics');

const { populateDatabase, populateWithHometasks, populateWithReviews, populateMaterials } = require('./services/fillDataForTests');
const {populateDbForTeacher, populateDbForStudent} = require('./services/populateFullDb');

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
app.use('/api/notifications', notificationRoutes);
app.use(routes);

const path = require("path");
const { logger } = require('@azure/storage-blob');
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
        //await populateDatabase();
        //   await populateWithHometasks();
        //await populateWithReviews();
        await populateMaterials();
        res.send('База даних успішно заповнена');
    } catch (error) {
        console.error(error);
        res.status(500).send('Помилка при заповненні бази даних');
    }
});

app.get('/populateFullDbForTeacher/:id', async (req, res) => {
    try {
        await populateDbForTeacher(req.params.id);
        res.send('База даних вчителя успішно заповнена');
    } catch (error) {
        console.error(error);
        res.status(500).send('Помилка при заповненні бази даних');
    }
});

app.get('/populateFullDbForStudent/:id', async (req, res) => {
    try {
        await populateDbForStudent(req.params.id);
        res.send('База даних студента успішно заповнена');
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

app.get('/', (req, res) => {
    const randomStatusCode = Math.floor(Math.random() * 100) + 200;
    res.status(200).send(`Test: ${randomStatusCode}`);
});


cron.schedule('0 3 * * *', async () => {
    console.log('[CRON] Запуск задачи по удалению старых записей');
    try {
        await deleteOldFiles();
        console.log('[CRON] Удаление выполнено успешно');
    } catch (error) {
        console.error('[CRON] Ошибка при выполнении удаления:', error);
    }
}, {
    timezone: 'Europe/Kyiv'
});

module.exports = app;