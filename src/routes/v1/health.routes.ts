import { Router } from "express";
import { healthCheck, dbHealthCheck, fullHealthCheck } from "../../controllers/health.controller";

const router = Router();

// Public endpoints - no authentication required
router.get("/", healthCheck);
router.get("/db", dbHealthCheck);
router.get("/full", fullHealthCheck);

export default router;