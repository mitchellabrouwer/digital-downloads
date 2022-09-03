/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Heading from "../../components/Heading";
import { getProducts, getPurchases } from "../../lib/data";
import prisma from "../../lib/prisma";

export default function Dashboard({ products, purchases }) {
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

  return (
    <div>
      <Head>
        <title>Digital Downloads</title>
        <meta name="description" content="Digital Downloads Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Heading />

      <h1 className="mt-20 flex justify-center text-xl">Dashboard</h1>

      <div className="mt-10 flex justify-center">
        <Link href="/dashboard/new">
          <a className="border p-2 text-xl">Create a new product</a>
        </Link>
      </div>

      <div className="mt-10 flex justify-center">
        {products.length > 0 && (
          <div className="flex w-full flex-col ">
            <h2 className="mb-4 text-center text-xl">Products</h2>

            {products.map((product) => (
              <div
                className="mx-auto my-2 flex w-full justify-between border px-4 py-5 md:w-2/3 xl:w-1/3 "
                key={product.id}
              >
                {product.image && (
                  <img src={product.image} className="h-14 w-14 flex-initial" />
                )}
                <div className="ml-3 flex-1">
                  <p>{product.title}</p>
                  {product.free ? (
                    <span className="bg-white px-1 font-bold uppercase text-black">
                      free
                    </span>
                  ) : (
                    <p>${product.price / 100}</p>
                  )}
                </div>
                <div className="">
                  <Link href={`/dashboard/product/${product.id}`}>
                    <a className="border p-2 text-sm font-bold uppercase">
                      Edit
                    </a>
                  </Link>
                  <Link href={`/product/${product.id}`}>
                    <a className="ml-2 border p-2 text-sm font-bold uppercase">
                      View
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {purchases.length > 0 && (
          <div className="flex w-full flex-col">
            <h2 className="mb-4 text-center text-xl">Purchases</h2>
            {purchases.map((purchase) => (
              <div
                className="mx-auto my-2 flex w-full justify-between border px-4 py-5 md:w-2/3 xl:w-1/3 "
                key={purchase.id}
              >
                {purchase.product.image && (
                  <img
                    src={purchase.product.image}
                    className="h-14 w-14 flex-initial"
                  />
                )}
                <div className="ml-3 flex-1">
                  <p>{purchase.product.title}</p>
                  {parseInt(purchase.amount, 10) === 0 ? (
                    <span className="bg-white px-1 font-bold uppercase text-black">
                      free
                    </span>
                  ) : (
                    <p>${purchase.amount / 100}</p>
                  )}
                </div>
                <div className="">
                  <a
                    href={purchase.product.url}
                    className="border p-2 text-sm font-bold uppercase"
                  >
                    Get files
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };

  let products = await getProducts({ author: session.user.id }, prisma);
  products = JSON.parse(JSON.stringify(products));

  let purchases = await getPurchases({ author: session.user.id }, prisma);
  purchases = JSON.parse(JSON.stringify(purchases));

  return {
    props: {
      products,
      purchases,
    },
  };
}
