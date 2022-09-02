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
