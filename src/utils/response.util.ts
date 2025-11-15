import { Response } from "express";
import { UserInterface } from "../types";

export const success = (res: Response, data: any, status: number = 200) => {
  // Wrap all responses in a consistent structure
  return res.status(status).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const error = (res: Response, message: string, status = 400) =>
  res.status(status).json({ 
    success: false,
    message,
    timestamp: new Date().toISOString(),
  });

export const validatePassword = async (user: UserInterface, candidate: string) =>
  user && (await user.comparePassword(candidate));