import { pool } from '../../db/index.js';

export const createGCS = async (id, data) => {
    try {
        return await pool.query(
            `INSERT INTO ground_control_stations (user_id, latitude, longitude, altitude)
            VALUES ($1, $2, $3, $4)
            RETURNING gcs_id`,
            [id, data.lat, data.lng, data.alt]
        );
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getAllUsersGCS = async (id) => {
    try {
        return await pool.query(
            `SELECT * FROM ground_control_stations
            WHERE user_id = $1`,
            [id]
        );
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const deleteGCS = async (gcs_id) => {
    try {
        return await pool.query(
            `DELETE FROM ground_control_stations
            WHERE gcs_id = $1`,
            [gcs_id]
        );
    } catch (err) {
        console.error(err);
        throw err;
    }
};
