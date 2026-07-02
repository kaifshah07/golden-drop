import { Response } from "express";
import { AddressService } from "./address.service";

export class AddressController {

  static async create(req: any, res: Response) {
    try {

      const userId = BigInt(req.user.userId);

      const address =
        await AddressService.createAddress(
          userId,
          req.body
        );

      return res.status(201).json({
        success: true,
        message: "Address created successfully",
        data: address,
      });

    } catch (err: any) {

      return res.status(500).json({
        success: false,
        message: err.message,
      });

    }
  }

  static async getAll(req: any, res: Response) {

    try {

      const userId = BigInt(req.user.userId);

      const addresses =
        await AddressService.getUserAddresses(userId);

      return res.status(200).json({
        success: true,
        data: addresses,
      });

    } catch (err: any) {

      return res.status(500).json({
        success: false,
        message: err.message,
      });

    }
  }

  static async update(req: any, res: Response) {

    try {

      const userId = BigInt(req.user.userId);

      const addressId = BigInt(req.params.id);

      const updated =
        await AddressService.updateAddress(
          addressId,
          userId,
          req.body
        );

      return res.status(200).json({
        success: true,
        message: "Address updated",
        data: updated,
      });

    } catch (err: any) {

      return res.status(500).json({
        success: false,
        message: err.message,
      });

    }
  }

  static async delete(req: any, res: Response) {

    try {

      const addressId = BigInt(req.params.id);

      await AddressService.deleteAddress(addressId);

      return res.status(200).json({
        success: true,
        message: "Address deleted",
      });

    } catch (err: any) {

      return res.status(500).json({
        success: false,
        message: err.message,
      });

    }
  }

}