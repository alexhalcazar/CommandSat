import { createClient } from 'redis';

const username = process.env.REDIS_USERNAME;
const password = process.env.REDIS_PASSWORD;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

export const redisClient = createClient({
    username: username,
    password: password,
    socket: {
        host: redisHost,
        port: redisPort,
    },
});

export const subscriber = redisClient.duplicate();

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});
subscriber.on('error', (err) => {
    console.error('Redis Subscriber Error:', err);
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        await subscriber.connect();
    } catch (err) {
        console.log(err);
    }
};
