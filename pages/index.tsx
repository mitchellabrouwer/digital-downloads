/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Head from "next/head";
import Link from "next/link";
import Heading from "../components/Heading";
import { getProducts } from "../lib/data";
import prisma from "../lib/prisma";

export default function Home({ products }) {
  return (
    <div>
      <Head>
        <title>Digital Downloads</title>
        <meta name="description" content="Digital Downloads Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Heading />

      <h1 className="mt-20 flex justify-center text-xl">
        Explore the most popular products
      </h1>

      <div className="mt-10 flex justify-center">
        <div className="flex w-full flex-col ">
          {products &&
            products.map((product) => (
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
                  <Link href={`/product/${product.id}`}>
                    <a className="ml-2 border p-2 text-sm font-bold uppercase">
                      View
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

export async function getServerSideProps() {
  let products = await getProducts({ take: 3 }, prisma);
  products = JSON.parse(JSON.stringify(products));

  return {
    props: {
      products,
    },
  };
}
