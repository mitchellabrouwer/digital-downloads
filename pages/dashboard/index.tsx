/* eslint-disable react/no-array-index-key */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";

import Link from "next/link";
import { useRouter } from "next/router";
import Heading from "../../components/Heading";
import { getProducts } from "../../lib/data";
import prisma from "../../lib/prisma";

export default function Dashboard({ products }) {
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
        <meta name="description" content="Digital Downloads website"></meta>
        <link rel="icon" href="/favicon.ico"></link>
      </Head>

      <Heading />

      <h1 className="mt-20 flex justify-center text-xl">Dashboard</h1>

      <div className="mt-10 flex justify-center">
        <Link href="/dashboard/new">
          <a className="border p-2 text-xl">Create a new product</a>
        </Link>
      </div>

      <div className="mt-10 flex justify-center">
        <div className="flex w-full flex-col ">
          {products &&
            products.map((product, index) => (
              <div
                className="mx-auto my-2 flex w-full justify-between border px-4 py-5 md:w-2/3 xl:w-1/3 "
                key={index}
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
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return { props: {} };
  }
  let products = await getProducts({ author: session.user.id }, prisma);
  products = JSON.parse(JSON.stringify(products));

  return {
    props: {
      products,
    },
  };
}
