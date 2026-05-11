import { verifyAccessToken } from '#utils/jwtUtils';

export default (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
