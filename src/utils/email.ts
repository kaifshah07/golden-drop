import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: Number(env.EMAIL_PORT) === 465,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Verify Failed:", error);
  } else {
    console.log("✅ SMTP Server Ready");
  }
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent successfully to ${to}`);
    console.log(`Message ID: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};