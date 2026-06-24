import winston from "winston";
import { env } from "./env";

const logLevel = env.NODE_ENV === "production" ? "info" : "debug";

const logger = winston.createLogger({
  level: logLevel,

  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),

  transports: [
    // Console logs (always useful in dev)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, stack }) => {
          return `${timestamp} [${level}]: ${stack || message}`;
        })
      ),
    }),
  ],
});

export default logger;