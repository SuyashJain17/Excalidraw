import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export function middleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId?: string };

    if (decoded && decoded.userId) {
        req.userId = decoded.userId;
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized"
        });
    }
}
