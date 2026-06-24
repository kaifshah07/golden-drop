import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // set true in production (HTTPS)
  sameSite: "lax" as const,
  path: "/",
};

export class AuthController {
  // 🟢 REGISTER
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      const result = await AuthService.register({
        email,
        password,
        name,
      });

      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }

  // 🟡 LOGIN
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login({
        email,
        password,
      });

      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  }

  // 🔵 REFRESH TOKEN
  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token missing",
        });
      }

      const result = await AuthService.refresh(refreshToken);

      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: result.accessToken,
        },
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || "Token refresh failed",
      });
    }
  }

  // 🔴 LOGOUT
  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie("refreshToken", COOKIE_OPTIONS);

      await AuthService.logout();

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Logout failed",
      });
    }
  }
}