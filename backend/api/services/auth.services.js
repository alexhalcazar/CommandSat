import { createUser, findUserByEmail } from '../models/users.js';
import { hashPassword, verifyPassword } from '#utils/hash';
import { generateAccessToken } from '#utils/jwtUtils';

export const registerUser = async (username, email, password) => {
    try {
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            const error = new Error('Email already exists');
            error.status = 409;
            throw error;
        }

        const passwordHash = await hashPassword(password);
        const result = await createUser(username, email, passwordHash);
        const user = {
            user_id: result.rows[0].user_id,
            username: result.rows[0].username,
            email: result.rows[0].email,
        };
        return generateAccessToken(user);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const loginUser = async (email, password) => {
    try {
        const user = await findUserByEmail(email);

        if (!user) {
            const error = new Error('No user with email found');
            error.status = 404;
            throw error;
        }

        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
            const error = new Error('Incorrect Password');
            error.status = 401;
            throw error;
        }

        return generateAccessToken(user);
    } catch (err) {
        console.error(err);
        throw err;
    }
};
