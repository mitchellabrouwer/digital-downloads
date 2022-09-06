import { getSession } from "next-auth/react";
import { getReview } from "../../lib/data";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(501).end();
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (req.method === "GET") {
    console.log(req.query.product);

    const review = await getReview(session.user.id, req.query.product, prisma);

    console.log("review", review);
    return res.json(review);
  }

  if (req.method === "POST") {
    await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: req.body.product,
        },
      },
      update: {
        rating: req.body.rating,
        comment: req.body.comment,
      },
      create: {
        product: { connect: { id: req.body.product } },
        user: { connect: { id: session.user.id } },
        rating: req.body.rating,
        comment: req.body.comment,
      },
    });
  }

  return res.end();
}
