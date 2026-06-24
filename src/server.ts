import express from "express";
import { env } from "./config/env";
import logger from "./config/logger";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import userRoutes from "./modules/user/user.routes";
import productRoutes from "./modules/product/product.routes";
import variantRoutes from "./modules/variants/variant.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/order/order.routes";
import paymentRoutes from "./modules/payment/payment.routes";










(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
const app = express();

/**
 * Middlewares
 */
app.use(express.json());

/**
 * Health check route
 */
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

/**
 * TODO: routes will come here
 * app.use("/api/auth", authRoutes);
 * app.use("/api/products", productRoutes);
 * app.use("/api/orders", orderRoutes);
 */

/**
 * Global error handler (must be LAST)
 */
app.use(errorHandler);

/**
 * Start server
 */
app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
});

app.use("/api/auth", authRoutes);

app.use(cookieParser());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use(errorHandler);

app.use("/api/variants", variantRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);