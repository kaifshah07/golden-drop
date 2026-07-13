import { prisma } from "../../config/prisma";


export class ReviewService {

  // Add review
  static async addReview(
    userId: number,
    data: {
      productId: number;
      rating: number;
      review?: string;
    }
  ) {

    // prevent duplicate review per user per product
    const existing =
      await prisma.review.findFirst({
        where: {
          userId,
          productId: data.productId,
        },
      });

    if (existing) {
      throw new Error("You already reviewed this product");
    }

    return prisma.review.create({
      data: {
        userId,
        productId: data.productId,
        rating: data.rating,
        review: data.review,
      },
    });
  }

  // Get reviews for product
  static async getProductReviews(productId: number) {
    return prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Delete review (owner or admin later)
  static async deleteReview(reviewId: number, userId: number) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.userId !== BigInt(userId)) {
      throw new Error("Not authorized");
    }

    return prisma.review.delete({
      where: { id: reviewId },
    });
  }
}