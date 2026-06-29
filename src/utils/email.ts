import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent successfully to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};