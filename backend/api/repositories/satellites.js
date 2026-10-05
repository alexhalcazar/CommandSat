export const satelliteRepository = (pool) => ({
    insertSatellites: async (gcs_id, satellites) => {
        const buildInsertValues = (items, fields, columnCount) => {
            const values = items
                .map((_, i) => {
                    // console.log('This satellite', _);
                    const offset = i * columnCount;
                    const placeholders = Array.from(
                        { length: columnCount },
                        (_, j) => `$${offset + j + 1}`
                    ).join(', ');
                    return `(${placeholders})`;
                })
                .join(',');
            const params = items.flatMap(fields);
            return { values, params };
        };

        const catalog = buildInsertValues(
            satellites,
            (s) => [s.satid, s.satname, s.launchDate],
            3
        );
        const position = buildInsertValues(
            satellites,
            (s) => [
                s.satid,
                s.satlat,
                s.satlng,
                s.satalt,
                s.velocity,
                s.recorded_at,
            ],
            6
        );
        const gcsSat = buildInsertValues(
            satellites,
            (s) => [
                s.satid,
                gcs_id,
                s.signal_strength,
                s.battery_level,
                s.mode,
                s.updated_at,
            ],
            6
        );
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const catalogResult = await client.query(
                `INSERT INTO satellite_catalog (
                satid, satname, launch_date
            )
            VALUES ${catalog.values}
            ON CONFLICT DO NOTHING
            RETURNING *`,
                catalog.params
            );

            const positionResult = await client.query(
                `INSERT INTO satellite_position (
                satid, satlat, satlng, satalt, velocity,
                recorded_at
            )
            VALUES ${position.values}
            RETURNING *`,
                position.params
            );

            const gcsSatResult = await client.query(
                `INSERT INTO gcs_satellites (
                satid, gcs_id, signal_strength, battery_level,
                mode, updated_at
            )
            VALUES ${gcsSat.values}
            ON CONFLICT (satid, gcs_id)
            DO UPDATE SET
                signal_strength = EXCLUDED.signal_strength,
                battery_level = EXCLUDED.battery_level,
                mode = EXCLUDED.mode,
                updated_at = EXCLUDED.updated_at
            RETURNING *`,
                gcsSat.params
            );

            await client.query('COMMIT');

            return {
                catalog: catalogResult.rows,
                position: positionResult.rows,
                gcsSat: gcsSatResult.rows,
            };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },
});
