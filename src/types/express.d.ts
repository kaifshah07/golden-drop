import { Request } from "express";

import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export {};

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "user" | "admin" | "seller";
  };
}