const client = require('prom-client');

let register = new client.Registry();

const responseTimeHistogram = new client.Histogram({
    name: 'http_response_time_seconds',
    help: 'Histogram of HTTP response times in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

const totalRequestsCounter = new client.Counter({
    name: 'http_requests_all_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route']
});

const successfulRequestsCounter = new client.Counter({
    name: 'http_requests_successful_total',
    help: 'Total number of successful HTTP requests',
    labelNames: ['method', 'route']
});

const failedRequestsCounter = new client.Counter({
    name: 'http_requests_failed_total',
    help: 'Total number of failed HTTP requests',
    labelNames: ['method', 'route']
});

const redirectedRequestsCounter = new client.Counter({
    name: 'http_requests_redirected_total',
    help: 'Total number of redirected HTTP requests',
    labelNames: ['method', 'route']
});

const clientErrorRequestsCounter = new client.Counter({
    name: 'http_requests_client_error_total',
    help: 'Total number of client error HTTP requests',
    labelNames: ['method', 'route']
});

const serverErrorRequestsCounter = new client.Counter({
    name: 'http_requests_server_error_total',
    help: 'Total number of server error HTTP requests',
    labelNames: ['method', 'route']
});

register.registerMetric(responseTimeHistogram);
register.registerMetric(totalRequestsCounter);
register.registerMetric(successfulRequestsCounter);
register.registerMetric(failedRequestsCounter);
register.registerMetric(redirectedRequestsCounter);
register.registerMetric(clientErrorRequestsCounter);
register.registerMetric(serverErrorRequestsCounter);

register.setDefaultLabels({
    app: 'tutor-crm-api'
});

client.collectDefaultMetrics({ register });

const metricsMiddleware = (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const responseTimeInSeconds = (Date.now() - startTime) / 1000;

        responseTimeHistogram.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        }, responseTimeInSeconds);

        totalRequestsCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path
        });

        if (res.statusCode >= 200 && res.statusCode < 300) {
            successfulRequestsCounter.inc({
                method: req.method,
                route: req.route ? req.route.path : req.path
            });
        } else if (res.statusCode >= 400 && res.statusCode < 500) {
            clientErrorRequestsCounter.inc({
                method: req.method,
                route: req.route ? req.route.path : req.path
            });
            failedRequestsCounter.inc({
                method: req.method,
                route: req.route ? req.route.path : req.path
            });
        } else if (res.statusCode >= 500) {
            serverErrorRequestsCounter.inc({
                method: req.method,
                route: req.route ? req.route.path : req.path
            });
            failedRequestsCounter.inc({
                method: req.method,
                route: req.route ? req.route.path : req.path
            });
        } else if (res.statusCode >= 300 && res.statusCode < 400) {
            redirectedRequestsCounter.inc({
                method: req.method,
                route: req.route ? req.route.path : req.path
            });
        } else {
            failedRequestsCounter.inc({
                method: req.method,
                route: req.route ? req.route.path : req.path
            });
        }
    });

    next();
};

module.exports = {
    metricsMiddleware,
    register
};