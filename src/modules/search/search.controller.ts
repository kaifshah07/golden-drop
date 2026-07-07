import { Request, Response } from "express";
import { SearchService } from "./search.service";

export class SearchController {
  static async search(
    req: Request,
    res: Response
  ) {
    try {
      const q = String(req.query.q || "");

      const result =
        await SearchService.search(q);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}