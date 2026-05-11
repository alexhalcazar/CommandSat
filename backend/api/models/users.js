import { pool } from '../../db/index.js';

export const createUser = async (username, email, passwordHash) => {
    try {
        return await pool.query(
            `INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING user_id, username, email`,
            [username, email, passwordHash]
        );
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const findByUserId = async (id) => {
    try {
        return await pool.query(
            `SELECT * FROM users 
            WHERE user_id = $1`,
            [id]
        );
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const activeSwitch = async (id) => {
    try {
        await pool.query(
            `Update users
            SET is_active = NOT is_active
            WHERE user_id = $1`,
            [id]
        );
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const onboardUser = async (id) => {
    try {
        return await pool.query(
            `Update users
            SET has_logged_in = TRUE
            WHERE user_id = $1`,
            [id]
        );
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const findUserByEmail = async (email) => {
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
};
