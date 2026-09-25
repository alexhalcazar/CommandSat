export const gcsRepository = (pool) => ({
    createGCS: async (id, data) => {
        const result = await pool.query(
            `INSERT INTO ground_control_stations (user_id, latitude, longitude, altitude)
                VALUES ($1, $2, $3, $4)
                RETURNING gcs_id`,
            [id, data.lat, data.lng, data.alt]
        );
        return result.rows[0];
    },
    getAllUsersGCS: async (id) => {
        const result = await pool.query(
            `SELECT * FROM ground_control_stations
                WHERE user_id = $1`,
            [id]
        );
        return result.rows;
    },
    deleteGCS: async (gcs_id) => {
        const result = await pool.query(
            `DELETE FROM ground_control_stations
                WHERE gcs_id = $1
                RETURNING *`,
            [gcs_id]
        );
        return result.rows[0];
    },
});
