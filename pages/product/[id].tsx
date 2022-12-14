/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import Heading from "../../components/Heading";
import { alreadyPurchased, getProduct } from "../../lib/data";
import prisma from "../../lib/prisma";

export default function Product({ product, purchased }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const loading = status === "loading";

  if (loading) {
    return null;
  }

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
      <Script src="https://js.stripe.com/v3/" async></Script>

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
              {!session && <p>Login first</p>}
              {session && (
                <div>
                  {purchased ? (
                    "Already purchased"
                  ) : (
                    <div>
                      {session.user.id !== product.author.id ? (
                        <button
                          type="button"
                          className="border p-2 text-sm font-bold uppercase"
                          onClick={async () => {
                            if (product.free) {
                              await fetch("/api/download", {
                                body: JSON.stringify({ productId: product.id }),
                                headers: { "Content-Type": "application/json" },
                                method: "POST",
                              });
                            } else {
                              console.log(product.id);

                              const res = await fetch("/api/stripe/session", {
                                body: JSON.stringify({
                                  amount: product.price,
                                  title: product.title,
                                  productId: product.id,
                                }),
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                method: "POST",
                              });

                              const data = await res.json();

                              if (data.status === "error") {
                                return alert(data.message);
                              }
                              const { sessionId } = data;
                              const { stripePublicKey } = data;

                              // @ts-ignore
                              // eslint-disable-next-line no-undef
                              const stripe = Stripe(stripePublicKey);
                              await stripe.redirectToCheckout({
                                sessionId,
                              });
                            }
                            return router.push("/dashboard");
                          }}
                        >
                          {product.free ? "DOWNLOAD" : "PURCHASE"}
                        </button>
                      ) : (
                        "Your product"
                      )}
                    </div>
                  )}
                </div>
              )}
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
  const session = await getSession(context);

  let product = await getProduct(context.params.id, prisma);

  let purchased = null;
  if (session) {
    purchased = await alreadyPurchased(
      {
        product: context.params.id,
        author: session.user.id,
      },
      prisma
    );
  }

  product = JSON.parse(JSON.stringify(product));

  return {
    props: {
      product,
      purchased,
    },
  };
}
