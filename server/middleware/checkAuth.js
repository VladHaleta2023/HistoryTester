import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        delete req.headers.authorization;
        res.clearCookie("token");
        
        return res.status(400).json({
            success: false,
            message: `Nie masz dostępu. Proszę się zalogować`
        })
    }

    if (token) {
        try {
            req.headers.authorization = `Bearer ${token}`;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
            req.token = token;
            next();
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                message: `Nie masz dostępu. Proszę się zalogować`
            })
        }
    }
    else {
        return res.status(400).json({
            success: false,
            message: `Nie masz dostępu. Proszę się zalogować`
        })
    }
}