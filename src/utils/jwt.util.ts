import jwt, { Secret } from "jsonwebtoken";
import type { StringValue } from "ms";
import { UserInterface } from "../types";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../config/env.config";

interface TokenPayload{
  id: string;  
  email: string;
}

// Explicitly type the secrets
const accessTokenSecret: Secret = ACCESS_TOKEN_SECRET;
const refreshTokenSecret: Secret = REFRESH_TOKEN_SECRET;

// Cast expiry strings to StringValue type
const accessTokenExpiry = ACCESS_TOKEN_EXPIRY as StringValue;
const refreshTokenExpiry = REFRESH_TOKEN_EXPIRY as StringValue;

//generate access and refresh token helper functions.

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: accessTokenExpiry });
}

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: refreshTokenExpiry });
}

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, accessTokenSecret) as TokenPayload;
}

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, refreshTokenSecret) as TokenPayload;
};

//if you provide user, it will make payload with _id and email.
export const createPayload = (user: UserInterface): TokenPayload => ({ 
  id: user.id, 
  email: user.email 
});