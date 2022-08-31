import { Prisma, PrismaClient } from "@prisma/client";

export const getProducts = async (options, prisma: PrismaClient) => {
  const data: Prisma.ProductFindManyArgs = {
    where: {},
    orderBy: [{ createdAt: "desc" }],
  };

  if (options.author) {
    data.where.author = { id: options.author };
  }

  const products = await prisma.product.findMany(data);

  return products;
};
