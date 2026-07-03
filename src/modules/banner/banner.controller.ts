import { Request, Response } from "express";
import { BannerService } from "./banner.service";

export class BannerController {
  static async create(req: Request, res: Response) {
    try {
      const banner = await BannerService.createBanner(req.body);

      return res.status(201).json({
        success: true,
        message: "Banner created successfully",
        data: banner,
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const banners = await BannerService.getAllBanners();

      return res.status(200).json({
        success: true,
        data: banners,
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const banner = await BannerService.getBanner(
        Number(req.params.id)
      );

      return res.status(200).json({
        success: true,
        data: banner,
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const banner = await BannerService.updateBanner(
        Number(req.params.id),
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Banner updated successfully",
        data: banner,
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await BannerService.deleteBanner(Number(req.params.id));

      return res.status(200).json({
        success: true,
        message: "Banner deleted successfully",
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  }
}