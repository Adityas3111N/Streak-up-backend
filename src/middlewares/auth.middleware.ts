import { Request, Response, NextFunction, RequestHandler } from "express";
import { error } from "../utils/response.util";
import { verifyAccessToken } from "../utils/jwt.util";

import { TokenPayload } from "../types";

export interface AuthRequest extends Request {
    auth?: TokenPayload;
    cookies: { [key: string]: string };
} 

// AuthRequest is like the normal Express Request but with extra stuff:
// - 'user' to store the logged-in user's info after verifying the token
// - 'cookies' to type the cookies object

export const isAuthenticated: RequestHandler = (req, res, next) => {
    try {
        const token = (req as AuthRequest).cookies?.accessToken
            || req.get("Authorization")?.replace("Bearer ", "")
            || (req.body && (req.body as any).accessToken);

        if (!token) {
            error(res, "No token provided", 401);
            return;
        }

        const decoded = verifyAccessToken(token) as TokenPayload;
        (req as AuthRequest).auth = decoded;

        next();
    } catch (err) {
        error(res, "Invalid or expired token", 403);
    }
}


//example usecase
// import { Router } from "express";
// import { isAuthenticated } from "../middlewares/isAuthenticated";

// const router = Router();

// router.get("/protected", isAuthenticated, (req, res) => {
//   res.json({ message: "Access granted", user: (req as any).user });
// });

// export default router;
