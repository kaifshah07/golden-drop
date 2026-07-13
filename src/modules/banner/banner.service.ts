import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

interface CreateBannerInput {
  title: string;
  image: string;
  status?: boolean;
}

export class BannerService {
  // CREATE
  static async createBanner(data: CreateBannerInput) {
    return prisma.banner.create({
      data: {
        title: data.title,
        image: data.image,
        status: data.status ?? true,
      },
    });
  }

  // GET ALL
  static async getAllBanners() {
    return prisma.banner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // GET ONE
  static async getBanner(id: number) {
    const banner = await prisma.banner.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!banner) {
      throw new AppError("Banner not found", 404);
    }

    return banner;
  }

  // UPDATE
  static async updateBanner(
    id: number,
    data: Partial<CreateBannerInput>
  ) {
    await this.getBanner(id);

    return prisma.banner.update({
      where: {
        id: BigInt(id),
      },
      data,
    });
  }

  // DELETE
  static async deleteBanner(id: number) {
    await this.getBanner(id);

    return prisma.banner.delete({
      where: {
        id: BigInt(id),
      },
    });
  }
}