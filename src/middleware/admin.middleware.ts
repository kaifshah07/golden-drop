import { Request, Response, NextFunction } from "express";

export const adminOnly = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Authorization error",
    });
  }
};