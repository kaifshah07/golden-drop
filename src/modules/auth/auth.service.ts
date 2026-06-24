import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./auth.utils";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";

export class AuthService {
  // 🟢 REGISTER
  static async register(data: {
    email: string;
    password: string;
    name: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: "CUSTOMER",
      },
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  // 🟡 LOGIN
  static async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  // 🔵 REFRESH TOKEN
  static async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error("Refresh token missing");
    }

    let decoded: { userId: string };

    try {
      decoded = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET
      ) as { userId: string };
    } catch {
      throw new Error("Invalid refresh token");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // 🔴 LOGOUT
  static async logout() {
    return true;
  }
}