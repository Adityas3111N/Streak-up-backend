import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { error } from "../utils/response.util";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Handle ZodError (in case it somehow reaches here)
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            errors: err.issues.map((e: any) => ({
                field: e.path.join("."),
                message: e.message
            }))
        });
    }

    // Log error stack if it exists
    if (err?.stack) {
        console.error(err.stack);
    } else {
        console.error(err);
    }

    const statusCode = err.status || 500;
    const message = err.message || "Internal server error";

    return error(res, message, statusCode);
}