import { prisma } from "../../config/prisma";

export class AddressService {
  static async createAddress(userId: number, data: any) {
    // If user sets default, unset previous default
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  static async getUserAddresses(userId: number) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateAddress(addressId: number, userId: number, data: any) {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  static async deleteAddress(addressId: number) {
    return prisma.address.delete({
      where: { id: addressId },
    });
  }
}