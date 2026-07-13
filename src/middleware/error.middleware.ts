import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { AppError } from "../utils/AppError";
import { sendError } from "../utils/apiResponse";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // Custom App Errors
  if (err instanceof AppError) {
    return sendError(res, {
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  // Prisma Known Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return sendError(res, {
          message: "Duplicate value found.",
          statusCode: 409,
        });

      case "P2025":
        return sendError(res, {
          message: "Record not found.",
          statusCode: 404,
        });

      default:
        return sendError(res, {
          message: "Database error.",
          statusCode: 500,
        });
    }
  }

  // Validation Errors
  if (err instanceof ZodError) {
    return sendError(res, {
      message: "Validation failed",
      errors: err.issues,
      statusCode: 400,
    });
  }

  // Unknown Errors
  return sendError(res, {
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
    statusCode: 500,
  });
};