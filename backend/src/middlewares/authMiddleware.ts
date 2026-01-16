import { Request, Response, NextFunction } from "express";
import { AuthUtils } from "../utils/authUtils";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const decoded = AuthUtils.verifyToken(token);
        (req as any).user = decoded;
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });

    }
}