/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";

import Link from "next/link";
import { useRouter } from "next/router";
import Heading from "../../components/Heading";
import { getSales } from "../../lib/data";
import prisma from "../../lib/prisma";

export default function Sales({ sales }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";

  if (loading) {
    return null;
  }

  if (!session) {
    router.push("/");
  }

  if (session && !session.user.name) {
    router.push("/setup");
  }

  console.log("sales", sales);

  return (
    <div>
      <Head>
        <title>Digital Downloads</title>
        <meta name="description" content="Digital Downloads Website"></meta>
        <Link rel="icon" href="/favicon.ico"></Link>
      </Head>

      <Heading />

      <h1 className="mt-20 mb-10 flex justify-center text-xl">Sales</h1>
      <h3 className="text-center text-xl">
        {sales.length > 0
          ? `Total earned $ ${
              sales.reduce(
                (accumulator, sale) => accumulator + parseFloat(sale.amount),
                0
              ) / 100
            }`
          : "Nothing sold yet"}
      </h3>

      {sales.length > 0 && (
        <div className="flex w-full flex-col">
          {sales.map((sale) => (
            <div
              className="mx-auto my-2 flex w-full justify-between border px-4 py-5 md:w-2/3 xl:w-1/3"
              key={sale.id}
            >
              {sale.product.image && (
                <img
                  src={sale.product.image}
                  className="h-14 w-14 flex-initial"
                />
              )}
              <div className="ml-3 flex-1">
                <p>{sale.product.title}</p>
                {parseInt(sale.amount, 10) === 0 ? (
                  <span className="bg-white px-1 font-bold uppercase text-black">
                    Free
                  </span>
                ) : (
                  <p>${sale.amount / 100}</p>
                )}
              </div>
              <div>
                <p className="p-2 text-sm font-bold">
                  {sale.author.name}
                  <br />
                  {sale.author.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return { props: {} };
  }

  let sales = await getSales({ author: session.user.id }, prisma);
  sales = JSON.parse(JSON.stringify(sales));

  console.log("sales", sales);

  return {
    props: {
      sales,
    },
  };
}
