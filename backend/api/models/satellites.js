import { pool } from '../../db/index.js';

export const insertSatellites = async (gcs_id, satellites) => {
    const values = satellites
        .map((_, i) => {
            const offeset = i * 13;
            return `($${offeset + 1}, $${offeset + 2}, $${offeset + 3},
                    $${offeset + 4}, $${offeset + 5}, $${offeset + 6},
                    $${offeset + 7}, $${offeset + 8}, $${offeset + 9},
                    $${offeset + 10}, $${offeset + 11}, $${offeset + 12},
                    $${offeset + 13})`;
        })
        .join(',');
    const params = satellites.flatMap((s) => [
        s.gcs_id,
        s.satid,
        s.satname,
        s.launch_date,
        s.satlat,
        s.satlng,
        s.satalt,
        s.velocity,
        s.last_contact_time,
        s.signal_strength,
        s.battery_level,
        s.mode,
        s.updated_at,
    ]);
    try {
        return await pool.query(
            `INSERT INTO satellites (
                gcs_id, satid, satname,
                launch_date, satlat, satlng,
                satalt, velocity, last_contact_time,
                signal_strength, battery_level, mode,
                updated_at
            )
            VALUES ${values}
            RETURNING *`,
            params
        );
    } catch (err) {
        console.error(err);
    }
};
