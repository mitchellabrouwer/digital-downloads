/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable consistent-return */
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Heading from "../../../components/Heading";
import { getProduct } from "../../../lib/data";
import prisma from "../../../lib/prisma";

export default function Product({ product }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState(product.title);
  const [image, setImage] = useState(null);
  const [newProduct, setNewProduct] = useState(null);

  const [imageUrl, setImageUrl] = useState(product.image);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price / 100);
  const [free, setFree] = useState(product.free);
  const [changedLink, setChangedLink] = useState(false);

  const loading = status === "loading";

  if (!product) {
    return null;
  }

  if (loading) {
    return null;
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

      <div className="flex justify-center">
        <form
          className="mt-10"
          onSubmit={async (e) => {
            e.preventDefault();

            const body = new FormData();
            body.append("id", product.id);
            body.append("image", image);
            body.append("product", newProduct);
            body.append("title", title);
            body.append("free", free);
            body.append("price", String(price));
            body.append("description", description);

            await fetch("/api/edit", {
              body,
              method: "POST",
            });

            router.push("/dashboard");
          }}
        >
          <div className="mb-5 flex-1">
            <div className="mb-2 flex-1">Product title (required)</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4 border p-1 text-black"
              required
            />
            <div className="relative mt-2 mb-3 flex items-start">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  checked={free}
                  onChange={() => setFree(!free)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label>Check if the product is free</label>
              </div>
            </div>
            {!free && (
              <>
                <div className="mb-2 flex-1">Product price in $ (required)</div>
                <input
                  value={price}
                  pattern="^\d*(\.\d{0,2})?$"
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mb-4 border p-1 text-black"
                  required
                />
              </>
            )}
            <div className="mb-2 flex-1">Description</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-1 text-black "
            />
          </div>

          <div className="text-sm text-gray-200 ">
            <label className="relative my-3 block  cursor-pointer font-medium">
              <p className="">Product image {image && "✅"}</p> (800 x 450
              suggested)
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  if (event.target.files && event.target.files[0]) {
                    if (event.target.files[0].size > 3072000) {
                      alert("Maximum size allowed is 3MB");
                      return false;
                    }
                    setImage(event.target.files[0]);
                    setImageUrl(URL.createObjectURL(event.target.files[0]));
                  }
                }}
              />
            </label>
            <img src={imageUrl} className="h-20 w-20" />
          </div>

          <div className="text-sm text-gray-200 ">
            <label className="relative my-3 block  cursor-pointer font-medium">
              <p className="">Product {product && "changed ✅"}</p>
              <input
                type="file"
                className="hidden"
                onChange={(event) => {
                  if (event.target.files && event.target.files[0]) {
                    if (event.target.files[0].size > 20480000) {
                      alert("Maximum size allowed is 20MB");
                      return false;
                    }
                    setNewProduct(event.target.files[0]);
                    setChangedLink(true);
                  }
                }}
              />
            </label>
            {!changedLink && (
              <a className="underline" href={product.url}>
                Link
              </a>
            )}
          </div>
          <button
            type="submit"
            disabled={!(title && (free || price))}
            className={`mt-10 border px-8 py-2 font-bold  ${
              title && (free || price)
                ? ""
                : "cursor-not-allowed border-gray-800 text-gray-800"
            }`}
          >
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return { props: {} };
  }

  let product = await getProduct(context.params.id, prisma);
  product = JSON.parse(JSON.stringify(product));

  if (!product) {
    return { props: {} };
  }

  if (session.user.id !== product.author.id) {
    return { props: {} }; // NOT OUR PRODUCT
  }

  return {
    props: {
      product,
    },
  };
}
