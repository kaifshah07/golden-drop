import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "./error.middleware";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const message = result.error.issues
          .map((err: any) => err.message)
          .join(", ");

        return next(new AppError(message, 400));
      }

      req.body = result.data;

      next();
    } catch {
      return next(new AppError("Validation failed", 400));
    }
  };