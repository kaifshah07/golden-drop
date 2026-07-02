import { prisma } from "../../config/prisma";

export class AddressService {

  static async createAddress(
    userId: bigint,
    data: any
  ) {

    if (data.isDefault) {

      await prisma.address.updateMany({
        where: {
          userId,
        },
        data: {
          isDefault: false,
        },
      });

    }

    return prisma.address.create({

      data: {

        userId,

        fullName: data.fullName,

        mobile: data.mobile,

        addressLine1: data.addressLine1,

        addressLine2: data.addressLine2,

        city: data.city,

        state: data.state,

        pincode: data.pincode,

        country: data.country,

        isDefault: data.isDefault ?? false,

      },

    });

  }

  static async getUserAddresses(userId: bigint) {

    return prisma.address.findMany({

      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

  }

  static async updateAddress(
    addressId: bigint,
    userId: bigint,
    data: any
  ) {

    if (data.isDefault) {

      await prisma.address.updateMany({

        where: {
          userId,
        },

        data: {
          isDefault: false,
        },

      });

    }

    return prisma.address.update({

      where: {
        id: addressId,
      },

      data,

    });

  }

  static async deleteAddress(
    addressId: bigint
  ) {

    return prisma.address.delete({

      where: {
        id: addressId,
      },

    });

  }

}