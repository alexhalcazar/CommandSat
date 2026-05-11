import { registerUser, loginUser } from '#services/auth.services';

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const token = await registerUser(username, email, password);
        res.status(201).json({ token });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};
