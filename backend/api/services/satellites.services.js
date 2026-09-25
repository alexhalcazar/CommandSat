import { redisClient } from '../config/redisClient.js';

export const pushJob = async (user_id, gcs) => {
    try {
        await redisClient.lPush(
            'satellite_jobs',
            JSON.stringify({
                user_id,
                gcs,
            })
        );
    } catch (err) {
        console.error(err);
    }
};
