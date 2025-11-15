import { Request, Response } from "express";
import User from "../models/user.model";

import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID } from "../config/env.config";


import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  createPayload
} from "../utils/jwt.util"

import {
  validatePassword,
  error,
  success
} from "../utils/response.util"

import { signupSchema, loginSchema } from "../validators/auth.validator";
import { AuthRequest } from "../middlewares/auth.middleware";

// Signup
export const signup = async (req: Request, res: Response) => {
  try {

    const { name, userName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) return error(res, "Username or email already exists", 400);

    // Create user
    const user = await User.create({ name, userName, email, password });

    // Generate tokens
    const payload = createPayload(user);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    return success(res, {
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, userName: user.userName },
    }, 201);

  } catch (err: any) {
    if (err.name === "ZodError") {
      const errorMessage = err.issues.map((e: any) => e.message).join(", ");
      return error(res, `Validation error: ${errorMessage}`, 400);
    }
    console.error(err);
    return error(res, "Server Error", 500);
  }
};


// Login
export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { identifier, password } = loginSchema.parse(req.body);

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user || !(await validatePassword(user, password)))
      return error(res, "Invalid credentials", 400);

    // Generate tokens
    const payload = createPayload(user);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    return success(res, {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userName: user.userName,
        onboardingCompleted: user.onboardingCompleted || false,
        currentWeek: user.currentWeek || 1,
        goalDate: user.goalDate ? user.goalDate.toISOString() : undefined
      },
    }, 200);

  } catch (err: any) {
    if (err.name === "ZodError") {
      const errorMessage = err.errors.map((e: any) => e.message).join(", ");
      return error(res, `Validation error: ${errorMessage}`, 400);
    }
    console.error(err);
    return error(res, "Server Error", 500);
  }
};

// Refresh Tokens
export const refreshToken = async (req: Request, res: Response) => {
  try {
    // Get token from body (mobile app) instead of cookies
    const { refreshToken: token } = req.body;
    if (!token) return error(res, "No refresh token provided", 401);

    // Verify token
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) // optional check
      return error(res, "Invalid refresh token", 401);

    // Generate new tokens
    const newAccessToken = generateAccessToken(createPayload(user));
    const newRefreshToken = generateRefreshToken(createPayload(user));

    // Save new refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    return success(res, { accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error(err);
    return error(res, "Invalid refresh token", 401);
  }
};


// Logout
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.id;
    if (!userId) return error(res, "Unauthorized", 401);

    const user = await User.findById(userId);
    if (!user) return error(res, "User not found", 404);


    if (!user.refreshToken)
      return error(res, "Already logged out or token invalidated.", 400);

    // Invalidate stored refresh token
    user.refreshToken = null;
    await user.save();

    // Optional: Instruct client to delete tokens
    return success(res, { message: "Logout successful. Tokens invalidated." });
  } catch (err) {
    console.error(err);
    return error(res, "Server error", 500);
  }
};


// Google Login

const client = new OAuth2Client(GOOGLE_CLIENT_ID)

const generateUserNameFromEmail = async (email: string): Promise<string> => {

  const baseUserName = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  let userName = baseUserName;
  let counter = 1;

  while (await User.findOne({ userName })) {
    userName = `${baseUserName}${counter}`;
    counter++;
  }

  return userName;
}

export const googleLogin = async (req: Request, res: Response) => {

  try {
    const { idToken } = req.body;
    if (!idToken) return error(res, "idToken is required", 400);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload?.email) {
      return error(res, "Invalid token payload", 400);
    }

    let user = await User.findOne({
      $or: [
        { socialId: payload.sub, socialProvider: "google" },
        { email: payload.email }
      ]
    });

    if (!user) {

      const userName = await generateUserNameFromEmail(payload.email);

      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        userName,
        email: payload.email,
        socialId: payload.sub,
        socialProvider: "google"
      });
    }
    else if (!user.socialProvider) {

      //if user exists with email but no social provider, link the account.
      user.socialId = payload.sub,
        user.socialProvider = "google",
        await user.save()
    }

    if (!user) return error(res, "Error while creating user", 400);

    //generate token using createPayload helper
    const tokenPayload = createPayload(user);
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    user.refreshToken = refreshToken;
    await user.save();

    return success(res,
      {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          userName: user.userName,
          email: user.email
        },
      }, 200
    )
  }
  catch (err: any) {

    if (err.name === "ValidationError")
      return error(res, err.message, 400);

    if (err.code === 11000)
      return error(res, "Email or username already exists", 400);

    console.error("Google login error:", err);
    return error(res, "Server error", 500);

  }
}