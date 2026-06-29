import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "5000",

  DATABASE_URL: process.env.DATABASE_URL || "",

  JWT_SECRET: process.env.JWT_SECRET || "",

  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "",

  AWS_ACCESS_KEY:
    process.env.AWS_ACCESS_KEY || "",

  AWS_SECRET_KEY:
    process.env.AWS_SECRET_KEY || "",

  RAZORPAY_KEY_ID:
    process.env.RAZORPAY_KEY_ID || "",

  RAZORPAY_SECRET:
    process.env.RAZORPAY_SECRET || "",

  EMAIL_HOST:
    process.env.EMAIL_HOST || "",

  EMAIL_PORT:
    process.env.EMAIL_PORT || "",

  EMAIL_USER:
    process.env.EMAIL_USER || "",

  EMAIL_PASS:
    process.env.EMAIL_PASS || "",

  EMAIL_FROM:
    process.env.EMAIL_FROM || "",

  FRONTEND_URL:
    process.env.FRONTEND_URL || "",

  NODE_ENV:
    process.env.NODE_ENV || "development",
};