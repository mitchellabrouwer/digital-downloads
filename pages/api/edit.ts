import { Prisma } from "@prisma/client";
import { NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nextConnect from "next-connect";
import prisma from "../../lib/prisma";
import { upload } from "../../lib/upload";
import middleware from "../../middleware/middleware";
import { Request } from "../../types/general";

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req: Request, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  // check if current user is not the same as product author
  const product = await prisma.product.findUnique({
    where: { id: req.body.id[0] },
    include: { author: true },
  });

  if (product.author.id !== user.id) {
    return res.status(401).json({ message: "User not owner of product" });
  }

  const { title, description, free, price } = req.body;

  await prisma.product.update({
    data: {
      title: title[0],
      description: description[0],
      free: free[0] === "true",
      price: price[0] * 100,
    },
    where: {
      id: product.id,
    },
  });

  let imageUrl = null;
  let productUrl = null;

  if (req.files.image) {
    imageUrl = await upload({
      file: req.files.image[0],
      userId: user.id,
    });
  }

  if (req.files.product) {
    productUrl = await upload({
      file: req.files.product[0],
      userId: user.id,
    });
  }

  const data: Prisma.ProductUpdateArgs["data"] & {
    url?: string;
    image?: string;
  } = {};

  if (productUrl) {
    data.url = productUrl;
  }

  if (imageUrl) {
    data.image = imageUrl;
  }

  await prisma.product.update({
    where: { id: product.id },
    data,
  });

  return res.end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
