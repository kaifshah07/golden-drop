import app from "./app";
import { env } from "./config/env";
import logger from "./config/logger";

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running on port ${env.PORT}`);
});

/**
 * Graceful Shutdown
 */
process.on("SIGINT", () => {
  logger.info("Shutting down server...");

  server.close(() => {
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  logger.info("Shutting down server...");

  server.close(() => {
    process.exit(0);
  });
});