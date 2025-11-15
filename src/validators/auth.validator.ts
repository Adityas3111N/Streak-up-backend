import { z } from "zod"

export const signupSchema = z.object({
    name: z.string().min(1, "Name is required."),
    userName: z.string().min(1, "Username is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export const loginSchema = z.object({
    identifier: z.string().min(1, "Email or username is required"), 
    password: z.string().min(1, "Password is required"),
})

export const googleLoginSchema = z.object({
    idToken: z.string().min(1, "Google ID token is required"),
})


//router.post("/signup", validate(signupSchema), signup);
// router.post("/login", validate(loginSchema), login);

