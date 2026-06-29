import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./auth.utils";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";
import { sendEmail } from "../../utils/email";

export class AuthService {

  // 🟢 REGISTER
  static async register(data: {
  name: string;
  email: string;
  mobile: string;
  password: string;
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
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    password: hashedPassword,
    role: "CUSTOMER",
  },
});

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return { user, accessToken, refreshToken };
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
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  }

  // 🔵 REFRESH TOKEN
  static async refresh(refreshToken: string) {
    let decoded: any;

    try {
      decoded = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET
      );
    } catch {
      throw new AppError("Invalid refresh token", 401);
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

  // 🔥 FORGOT PASSWORD
  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // do not reveal user existence
      return true;
    }

    const resetToken = jwt.sign(
      { userId: user.id },
      env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken },
    });

    const resetLink =
      `http://localhost:5000/reset-password?token=${resetToken}`;

    await sendEmail(
      user.email,
      "Reset Password",
      `Click here to reset your password: ${resetLink}`
    );

    return true;
  }

  // 🔥 RESET PASSWORD
  static async resetPassword(
    token: string,
    newPassword: string
  ) {
    let decoded: any;

    try {
      decoded = jwt.verify(
        token,
        env.JWT_SECRET
      );
    } catch {
      throw new AppError("Invalid or expired token", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.resetToken !== token) {
      throw new AppError("Invalid reset request", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
      },
    });

    return true;
  }
}