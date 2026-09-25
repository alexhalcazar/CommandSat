import { hashPassword, verifyPassword } from '#utils/hash';
import { generateAccessToken } from '#utils/jwtUtils';

export const createAuthService = (userService) => ({
    registerUser: async (username, email, password) => {
        try {
            const existingUser = await userService.findUserByEmail(email);

            if (existingUser) {
                const error = new Error('Email already exists');
                error.status = 409;
                throw error;
            }

            const passwordHash = await hashPassword(password);
            const result = await userService.newUser(
                username,
                email,
                passwordHash
            );
            const user = {
                user_id: result.user_id,
                username: result.username,
                email: result.email,
                isFirstLogin: true,
            };
            return generateAccessToken(user);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    loginUser: async (email, password) => {
        try {
            const existingUser = await userService.findUserByEmail(email);
            const user = { ...existingUser, isFirstLogin: false };

            if (!user) {
                const error = new Error('No user with email found');
                error.status = 404;
                throw error;
            }

            const isValidPassword = await verifyPassword(
                password,
                user.password
            );

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
    },
});
