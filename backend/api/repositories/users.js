export const userRepository = (pool) => ({
    createUser: async (username, email, passwordHash) => {
        try {
            const result = await pool.query(
                `INSERT INTO users (username, email, password)
                VALUES ($1, $2, $3)
                RETURNING user_id, username, email`,
                [username, email, passwordHash]
            );
            return result.rows[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    findByUserId: async (id) => {
        try {
            const result = await pool.query(
                `SELECT * FROM users 
                WHERE user_id = $1`,
                [id]
            );
            return result.rows[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    activeSwitch: async (id) => {
        try {
            const result = await pool.query(
                `UPDATE users
                SET is_active = NOT is_active
                WHERE user_id = $1
                RETURNING user_id, username, is_active`,
                [id]
            );
            return result.rows[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    findUserByEmail: async (email) => {
        try {
            const result = await pool.query(
                `SELECT * FROM users
                WHERE email = $1`,
                [email]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
});
