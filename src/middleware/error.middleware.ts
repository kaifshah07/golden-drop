import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

/**
 * Custom Application Error Class
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async Handler Wrapper
 * Eliminates try-catch in controllers
 */
export const asyncHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error(err);

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
};