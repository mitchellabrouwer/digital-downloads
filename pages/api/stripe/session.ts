import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { stripe } from "./stripe";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  console.log("amount", req.body.amount);
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Purchase product ${req.body.title}`,
            // save product id here
          },
          unit_amount: req.body.amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",

    success_url: `${process.env.BASE_URL}/dashboard`,
    cancel_url: `${process.env.BASE_URL}/dashboard`,
  });

  await prisma.purchase.create({
    data: {
      amount: req.body.amount,
      sessionId: stripeSession.id,
      author: { connect: { id: user.id } },
      product: { connect: { id: req.body.productId } },
    },
  });

  res.writeHead(200, { "Content-Type": "application/json" });

  return res.end(
    JSON.stringify({
      status: "success",
      sessionId: stripeSession.id,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    })
  );
};
