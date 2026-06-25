import { Response } from "express";
import { ShippingService } from "./shipping.service";

export class ShippingController {

  static async createShipment(
    req: any,
    res: Response
  ) {

    try {

      const orderId =
        Number(req.params.id);

      const result =
        await ShippingService.createShipment(
          orderId
        );

      return res.json({
        success: true,
        message:
          "Shipment created",
        data: result
      });

    } catch (err: any) {

      return res.status(400).json({
        success: false,
        message: err.message
      });

    }

  }

}