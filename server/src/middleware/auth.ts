import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
    userId: string,
}

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.header('Authorization');
        if(!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'No authentication token, access denied' });

        const token = authHeader.replace('Bearer ', '').trim() 

        if(!token) return res.status(401).json({message: "No authentication token, access denied"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        (req as any).user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default protectRoute;