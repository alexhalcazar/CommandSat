import { redisClient } from '../config/redisClient.js';

export const createSatelliteService = (satelliteRepository) => ({
    pushJob: async (user_id, gcs) => {
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
    },
    addGCSSatellites: async (gcs_id, satellites) => {
        try {
            return await satelliteRepository.insertSatellites(
                gcs_id,
                satellites
            );
        } catch (err) {
            console.log(err);
        }
    },
});
