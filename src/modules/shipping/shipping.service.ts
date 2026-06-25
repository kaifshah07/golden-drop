import { prisma } from "../../prisma/client";
import { AppError } from "../../utils/AppError";

export class ShippingService {

  static async createShipment(
    orderId: number
  ) {

    const order = await prisma.order.findUnique({
      where: {
        id: BigInt(orderId)
      }
    });

    if (!order) {
      throw new AppError(
        "Order not found",
        404
      );
    }

    if (
      order.orderStatus !== "PROCESSING"
    ) {
      throw new AppError(
        "Order must be PROCESSING before shipment",
        400
      );
    }

    // temporary AWB generation
    const awb =
      `GD${Date.now()}`;

    return prisma.order.update({
      where: {
        id: BigInt(orderId)
      },
      data: {
        trackingNumber: awb,
        courierName: "DELHIVERY",
        orderStatus: "SHIPPED"
      }
    });
  }

}