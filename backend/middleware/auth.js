import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_demo');
        req.user = decoded; // Gắn thông tin user vào request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};


export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || 'your_secret_key_demo',
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
};