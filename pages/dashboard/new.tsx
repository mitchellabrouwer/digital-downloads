/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";
import Heading from "../../components/Heading";

export default function NewProduct() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [product, setProduct] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [free, setFree] = useState(false);

  const loading = status === "loading";

  if (loading) {
    return null;
  }

  if (!session) {
    router.push("/");
  }

  return (
    <div>
      <Head>
        <title>Digital Downloads</title>
        <meta name="description" content="Digital Downloads Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Heading />

      <h1 className="mt-20 flex justify-center text-xl">Add a new product</h1>

      <div className="flex justify-center">
        <form
          className="mt-10"
          onSubmit={async (e) => {
            e.preventDefault();

            const body = new FormData();
            body.append("image", image);
            body.append("product", product);
            body.append("title", title);
            body.append("free", String(free));
            body.append("price", String(price));
            body.append("description", description);

            await fetch("/api/new", {
              body,
              method: "POST",
            });

            router.push(`/dashboard`);
          }}
        >
          <div className="mb-5 flex-1">
            <div className="mb-2 flex-1">Product title (required)</div>
            <input
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
                  pattern="^\d*(\.\d{0,2})?$"
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mb-4 border p-1 text-black"
                  required
                />
              </>
            )}
            <div className="mb-2 flex-1">Description</div>
            <textarea
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
                  }
                }}
              />
            </label>
          </div>

          <div className="text-sm text-gray-200 ">
            <label className="relative my-3 block  cursor-pointer font-medium">
              <p className="">Product {product && "✅"}</p> (required)
              <input
                type="file"
                className="hidden"
                onChange={(event) => {
                  if (event.target.files && event.target.files[0]) {
                    if (event.target.files[0].size > 20480000) {
                      alert("Maximum size allowed is 20MB");
                      return false;
                    }
                    setProduct(event.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={!(title && product && (free || price))}
            className={`mt-10 border px-8 py-2 font-bold  ${
              title && (free || price)
                ? ""
                : "cursor-not-allowed border-gray-800 text-gray-800"
            }`}
          >
            Create product
          </button>
        </form>
      </div>
    </div>
  );
}
