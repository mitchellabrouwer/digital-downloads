import { getSession } from "next-auth/react";
import { getSales } from "../../lib/data";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
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

  const sales = await getSales({ author: session.user.id }, prisma);

  return res.json(sales);
}
