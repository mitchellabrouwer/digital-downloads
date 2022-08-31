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
  if (!session) return res.status(401).json({ message: "Not logged in" });
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) return res.status(401).json({ message: "User not found" });

  const product = await prisma.product.create({
    data: {
      title: req.body.title[0],
      free: req.body.free[0] === "true",
      price: Number(req.body.price[0]) * 100,
      description: req.body.description[0],
      author: {
        connect: { id: user.id },
      },
    },
  });

  let imageURL = null;
  let productURL = null;

  if (req.files.image) {
    imageURL = await upload({
      file: req.files.image[0],
      userId: user.id,
    });
  }

  if (req.files.product) {
    productURL = await upload({
      file: req.files.product[0],
      userId: user.id,
    });
  }

  const data = {
    url: productURL,
    image: null,
  };

  if (imageURL) {
    data.image = imageURL;
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
