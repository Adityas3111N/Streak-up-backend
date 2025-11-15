import { Router } from "express";
import { signup, login, refreshToken, logout, googleLogin } from "../../controllers/auth.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

import { validate } from "../../middlewares/validate.middleware";
import { signupSchema, loginSchema, googleLoginSchema } from "../../validators/auth.validator";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refreshToken);
router.post("/logout", isAuthenticated, logout);
router.post("/google-login", validate(googleLoginSchema), googleLogin);


export default router;


//like this on frontend
// fetch("/api/v1/auth/logout", {
//   method: "POST",
//   headers: {
//     "Authorization": `Bearer ${accessToken}`,
//     "Content-Type": "application/json",
//   },
// });

// For mobile apps, the usual practice is:
// Store token locally (Secure Storage / Keychain / SharedPreferences).
// Send token in Authorization: Bearer <token> header for all protected requests.
// Logout flow:
// Call /logout endpoint with token in header (optional server-side token invalidation).
// Clear token from local storage on device.
