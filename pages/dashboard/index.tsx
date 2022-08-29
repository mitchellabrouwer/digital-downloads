import { useSession } from "next-auth/react";
import Head from "next/head";

import Link from "next/link";
import { useRouter } from "next/router";
import Heading from "../../components/Heading";

export default function Dashboard() {
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
    </div>
  );
}
