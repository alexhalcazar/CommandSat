import { redisClient } from '../config/redisClient.js';

export const pushJob = async (userId, gcs) => {
    try {
        await redisClient.lPush(
            'satellite_jobs',
            JSON.stringify({
                userId,
                gcs,
            })
        );
    } catch (err) {
        console.error(err);
    }
};
