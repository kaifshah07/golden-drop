import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./error.middleware";
import { AuthRequest } from "../types/express";

/**
 * 🔐 Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Not authorized, no token provided", 401));
    }

    const token = authHeader.split(" ")[1];

    if (!env.JWT_SECRET) {
      return next(new AppError("JWT secret not configured", 500));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload & {
      id: string;
      role: "user" | "admin" | "seller";
    };

    if (!decoded.id || !decoded.role) {
      return next(new AppError("Invalid token payload", 401));
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return next(new AppError("Not authorized, token is invalid or expired", 401));
  }
};

/**
 * 🛡 Authorization Middleware
 * Restricts access based on user roles
 */
export const authorize =
  (...roles: ("user" | "admin" | "seller")[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authorized", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Forbidden: insufficient permissions", 403)
      );
    }

    next();
  };


export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      role: string;
    };

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
