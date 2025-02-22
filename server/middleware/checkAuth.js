import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Nie masz dostępu. Proszę się zalogować",
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.token = token;
        next();
    } 
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "Nie masz dostępu. Proszę się zalogować",
        });
    }
}