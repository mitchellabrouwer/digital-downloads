/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Head from "next/head";
import Link from "next/link";
import Heading from "../../components/Heading";
import { getProduct } from "../../lib/data";
import prisma from "../../lib/prisma";

export default function Product({ product }) {
  if (!product) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>Digital Downloads</title>
        <meta name="description" content="Digital Downloads Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Heading />

      <div className="flex justify-center">
        <div className="mx-auto mt-10 flex w-full flex-col border px-4 md:w-2/3 xl:w-1/3">
          <div className="flex justify-between py-10">
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
              <button
                type="button"
                className="border p-2 text-sm font-bold uppercase"
              >
                PURCHASE
              </button>
            </div>
          </div>
          <div className="mb-10">{product.description}</div>
          <div className="mb-10">
            Created by
            <Link href={`/profile/${product.author.id}`}>
              <a className="ml-1 font-bold underline">{product.author.name}</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let product = await getProduct(context.params.id, prisma);
  product = JSON.parse(JSON.stringify(product));

  return {
    props: {
      product,
    },
  };
}
