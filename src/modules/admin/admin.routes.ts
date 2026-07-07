import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.dashboard
);
router.get(
  "/today-stats",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.todayStats
);

router.get(
  "/recent-orders",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.recentOrders
);

router.get(
  "/low-stock",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.lowStockProducts
);

router.get(
  "/top-products",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.topSellingProducts
);

router.get(
  "/monthly-sales",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.monthlySales
);

router.get(
  "/users",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.getUsers
);

router.get(
  "/users/:id",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.getUser
);

router.delete(
  "/users/:id",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.deleteUser
);

router.patch(
  "/users/:id/role",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.changeRole
);

router.get(
  "/orders",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.getOrders
);

router.get(
  "/orders/:id",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.getOrder
);

router.patch(
  "/orders/:id/status",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.updateOrderStatus
);

router.patch(
  "/orders/:id/payment",
  authenticate,
 authorize(["ADMIN"]),
  AdminController.updatePaymentStatus
);

router.get(
  "/reports/sales",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.salesReport
);

router.get(
  "/reports/customers",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.customerReport
);

router.get(
  "/reports/products",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.productReport
);

router.get(
"/export/users",
authenticate,
authorize(["ADMIN"]),
AdminController.exportUsers
);

router.get(
"/export/products",
authenticate,
authorize(["ADMIN"]),
AdminController.exportProducts
);

router.get(
"/export/orders",
authenticate,
authorize(["ADMIN"]),
AdminController.exportOrders
);

router.get(
  "/inventory-summary",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.inventorySummary
);

router.get(
  "/out-of-stock",
  authenticate,
  authorize(["ADMIN"]),
  AdminController.outOfStockProducts
);
export default router;