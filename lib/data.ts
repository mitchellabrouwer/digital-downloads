import { Prisma, PrismaClient } from "@prisma/client";

export const getProducts = async (options, prisma: PrismaClient) => {
  const data: Prisma.ProductFindManyArgs = {
    where: {},
    orderBy: [{ createdAt: "desc" }],
  };

  if (options.author) {
    data.where.author = { id: options.author };
  }

  if (options.take) {
    data.take = options.take;
  }

  if (options.sort) {
    data.orderBy = {
      sold: "desc",
    };
  }

  if (options.includePurchases) {
    data.include = { purchases: true };
  }

  const products = await prisma.product.findMany(data);

  return products;
};

export const getProduct = async (id, prisma) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { author: true },
  });

  return product;
};

export const getUser = async (id, prisma) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user;
};

export const getPurchases = async (options, prisma) => {
  const data: Prisma.PurchaseFindManyArgs = {
    where: { paid: true },
    orderBy: [{ createdAt: "desc" }],
    include: { product: true },
  };

  if (options.author) {
    data.where.author = { id: options.author };
  }

  const purchases = await prisma.purchase.findMany(data);

  return purchases;
};

export const alreadyPurchased = async (options, prisma) => {
  const purchases = await prisma.purchase.findMany({
    where: {
      product: { id: options.product },
      author: { id: options.author },
      paid: true,
    },
    include: {
      author: true,
      product: true,
    },
  });

  return purchases.length > 0;
};

export const getSales = async (options, prisma) => {
  const user = await prisma.user.findUnique({
    where: {
      id: options.author,
    },
    include: { products: true },
  });

  const purchases = await prisma.purchase.findMany({
    where: {
      paid: true,
      productId: { in: user.products.map((product) => product.id) },
    },
    include: { product: true, author: true },
  });

  return purchases;
};

export const getReview = async (productId, userId, prisma) => {
  const review = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  return review;
};

export const getReviewsAverage = async (productId, prisma) => {
  const rating = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
    where: {
      productId,
    },
  });

  return rating;
};
