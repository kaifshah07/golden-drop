import { prisma } from "../../config/prisma";

export class CouponService {

  static async validateCoupon(code: string, cartTotal: number) {

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      throw new Error("Invalid coupon code");
    }

    if (!coupon.status) {
      throw new Error("Coupon is inactive");
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      throw new Error("Coupon expired");
    }

    if (coupon.usedCount >= (coupon.usageLimit || Infinity)) {
      throw new Error("Coupon usage limit reached");
    }

    if (cartTotal < Number(coupon.minimumOrder)) {
      throw new Error(
        `Minimum order should be ${coupon.minimumOrder}`
      );
    }

    let discount = 0;

    if (coupon.type === "FIXED") {
      discount = Number(coupon.value);
    }

    if (coupon.type === "PERCENTAGE") {
      discount = (cartTotal * Number(coupon.value)) / 100;

      if (coupon.maxDiscount) {
        discount = Math.min(
          discount,
          Number(coupon.maxDiscount)
        );
      }
    }

    const finalTotal = cartTotal - discount;

    return {
      couponId: coupon.id,
      code: coupon.code,
      discount,
      finalTotal,
    };
  }

  static async markCouponUsed(code: string) {
    return prisma.coupon.update({
      where: { code },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });
  }
}