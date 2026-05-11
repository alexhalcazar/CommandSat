import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (err) {
        console.error('bycrpt hash failed', err);
        throw err;
    }
};

export const verifyPassword = async (password, passwordHash) => {
    try {
        return await bcrypt.compare(password, passwordHash);
    } catch (err) {
        console.error('bcrypt compare failed:', err);
        throw err;
    }
};
