import getRawBody from "raw-body";
import prisma from "../../../lib/prisma";
import { stripe } from "./stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end(); // Method Not Allowed
    return;
  }
  // const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"];

  const rawBody = await getRawBody(req, {
    encoding: "utf-8",
  });

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    res.writeHead(400, {
      "Content-Type": "application/json",
    });
    console.error(err.message);
    res.end(
      JSON.stringify({
        status: "success",
        message: `Webhook Error: ${err.message}`,
      })
    );
    return;
  }

  if (event.type === "checkout.session.completed") {
    const sessionId = event.data.object.id;

    try {
      const sessionProducts = await prisma.purchase.findMany({
        select: {
          productId: true,
        },
        where: {
          sessionId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      await prisma.purchase.updateMany({
        data: {
          paid: true,
          sessionId: "",
        },
        where: {
          sessionId,
        },
      });

      await prisma.product.updateMany({
        data: {
          sold: {
            increment: 1,
          },
        },
        where: {
          id: sessionProducts[0].productId,
        },
      });

      console.log("done");
    } catch (err) {
      console.error(err);
    }
  }

  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify({ received: true }));
};
