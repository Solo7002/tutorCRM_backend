const { getCache, setCache, deleteCache, clearAllCache } = require('../utils/cacheUtils.js');

// GET
async function cacheGetRequest(req, res, next, key, ttl) {
    const cachedData = await getCache(key);
    if (cachedData) {
        res.send(cachedData);
    } else {
        res.originalSend = res.send;
        res.send = async (body) => {
            if (res.statusCode <= 399) {
                await setCache(key, body, ttl);
            }
            res.originalSend(body);
        };
        next();
    }
}

// POST
async function handlePostRequest(req, res, key) {
    deleteCache(key);
}

// PUT
async function handlePutRequest(req, res, key, next) {
    const baseRoute = req.originalUrl.split('/').slice(0, -1).join('/');
    deleteCache(`__tutor_crm_api__${baseRoute}`);

    res.originalSend = res.send;
    res.send = async (body) => {
        if (res.statusCode <= 399) {
            await setCache(key, body, 3600);
        }
        res.originalSend(body);
    };
    next();
}

// DELETE
async function handleDeleteRequest(req, res, key) {
    await deleteCache(key);
    const baseRoute = req.originalUrl.split('/').slice(0, -1).join('/');
    deleteCache(`__tutor_crm_api__${baseRoute}`);
}

const cacheMiddleware = (ttl) => async (req, res, next) => {
    if (req.originalUrl.includes('/metrics')) {
        return next();
    }

    const key = `__tutor_crm_api__${req.originalUrl}`;
    const originalSend = res.send;

    res.send = async function (body) {
        if (res.statusCode <= 399) {
            switch (req.method) {
                case 'POST':
                    await handlePostRequest(req, res, key);
                    break;
                case 'DELETE':
                    await handleDeleteRequest(req, res, key);
                    break;
            }
        }
        originalSend.call(this, body);
    };

    if (req.method === 'GET') {
        await cacheGetRequest(req, res, next, key, ttl);
    } 
    else if (req.method === 'PUT'){
        await handlePutRequest(req, res, key, next);
    }
    else {
        next();
    }
};

module.exports = { cacheMiddleware };