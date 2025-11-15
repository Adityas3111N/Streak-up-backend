import { ZodObject, ZodRawShape, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: ZodObject<ZodRawShape>) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // For GET requests, validate req.query; for others, validate req.body
            // Ensure we always have an object (default to empty object if undefined)
            const dataToValidate = req.method === 'GET' 
                ? (req.query || {}) 
                : (req.body || {});
            
            schema.parse(dataToValidate);
            next();

        } catch (err: any) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: err.issues.map((e: any) => ({
                        field: e.path.join("."),
                        message: e.message
                    }))
                });
            }
            // fallback for other errors - pass to error handler
            console.error("Unexpected error in validate middleware:", err);
            next(err);
        }
    };