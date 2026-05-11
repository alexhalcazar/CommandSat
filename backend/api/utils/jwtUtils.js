import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
    const payload = {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TTL,
        algorithm: 'HS256',
    });
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
