const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
};

const setCache = async (key, value, ttl) => {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
};

const getCache = async (key) => {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
};

const updateCache = async (key, value, ttl) => {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
};

const deleteCache = async (key) => {
    await redisClient.del(key);
};

const clearAllCache = async () => {
    await redisClient.flushAll();
};

module.exports = { redisClient, connectRedis, setCache, getCache, updateCache, deleteCache, clearAllCache };