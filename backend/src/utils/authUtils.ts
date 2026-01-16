import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { JWTPayload } from '../types/index';


const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN ?? "7d";

export class AuthUtils {
    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    static generateToken(payload: JWTPayload): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
    }

    static verifyToken(token: string): JWTPayload {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    }
}

