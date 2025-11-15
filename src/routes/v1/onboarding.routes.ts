import { Router } from "express";
import { submitAnswers, getAnswers } from "../../controllers/onboarding.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { submitAnswersSchema } from "../../validators/onboarding.validator";

const router = Router();

router.post("/submit", isAuthenticated, validate(submitAnswersSchema), submitAnswers);
router.get("/answers", isAuthenticated, getAnswers);

export default router;