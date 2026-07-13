import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./docs/swagger";
import { errorHandler } from "./middleware/error.middleware";
import { sendError } from "./utils/apiResponse";

// Routes
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import productRoutes from "./modules/product/product.routes";
import variantRoutes from "./modules/variants/variant.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/order/order.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import addressRoutes from "./modules/address/address.routes";
import checkoutRoutes from "./modules/checkout/checkout.routes";
import adminRoutes from "./modules/admin/admin.routes";
import reviewRoutes from "./modules/review/review.routes";
import couponRoutes from "./modules/coupon/coupon.routes";
import blogRoutes from "./modules/blog/blog.routes";
import shippingRoutes from "./modules/shipping/shipping.routes";
import categoryRoutes from "./modules/category/category.routes";
import bannerRoutes from "./modules/banner/banner.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import searchRoutes from "./modules/search/search.routes";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app = express();

/**
 * Razorpay Webhook
 */
app.use(
  "/api/payment/webhook",
  express.raw({
    type: "application/json",
  })
);

/**
 * Global Middlewares
 */
app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(compression());

app.use(express.json());

app.use(cookieParser());

/**
 * Health Check
 */
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

/**
 * Swagger
 */
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

/**
 * Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);

/**
 * 404 Handler
 */
app.use((_req, res) => {
  return sendError(res, {
    message: "Route not found",
    statusCode: 404,
  });
});

/**
 * Global Error Handler
 */
app.use(errorHandler);

export default app;