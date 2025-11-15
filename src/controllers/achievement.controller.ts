import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { error, success } from "../utils/response.util";
import { getUserAchievements, getAllBadges } from "../services/acheivement.service";

/**
 * Get user's achievements
 */
export const getAchievements = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const achievements = await getUserAchievements(userId);

        return success(res, {
            achievements,
            count: achievements.length
        });

    } catch (err: any) {
        console.error("Get achievements error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Get all available badges
 */
export const getAvailableBadges = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const badges = getAllBadges();

        return success(res, {
            badges,
            count: badges.length
        });

    } catch (err: any) {
        console.error("Get available badges error:", err);
        return error(res, "Server error", 500);
    }
};