import { Request, Response } from "express";
import mongoose from "mongoose";
import { success, error } from "../utils/response.util";

/**
 * Basic health check endpoint
 */
export const healthCheck = async (req: Request, res: Response) => {
    try {
        return success(res, {
            status: "ok",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || "development"
        });
    } catch (err: any) {
        console.error("Health check error:", err);
        return error(res, "Health check failed", 500);
    }
};

/**
 * Database connection check
 */
export const dbHealthCheck = async (req: Request, res: Response) => {
    try {
        const dbState = mongoose.connection.readyState;
        const states = {
            0: "disconnected",
            1: "connected",
            2: "connecting",
            3: "disconnecting"
        };

        const isHealthy = dbState === 1;

        return success(res, {
            status: isHealthy ? "ok" : "error",
            database: {
                state: states[dbState as keyof typeof states] || "unknown",
                readyState: dbState,
                connected: isHealthy
            },
            timestamp: new Date().toISOString()
        }, isHealthy ? 200 : 503);

    } catch (err: any) {
        console.error("DB health check error:", err);
        return error(res, "Database health check failed", 500);
    }
};

/**
 * Full system health check
 */
export const fullHealthCheck = async (req: Request, res: Response) => {
    try {
        const dbState = mongoose.connection.readyState;
        const dbConnected = dbState === 1;

        const health = {
            status: dbConnected ? "healthy" : "degraded",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || "development",
            services: {
                database: {
                    status: dbConnected ? "ok" : "error",
                    readyState: dbState
                },
                api: {
                    status: "ok"
                }
            }
        };

        return success(res, health, dbConnected ? 200 : 503);

    } catch (err: any) {
        console.error("Full health check error:", err);
        return error(res, "Health check failed", 500);
    }
};