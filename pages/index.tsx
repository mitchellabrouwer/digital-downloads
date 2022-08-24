import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Head>
        <title />
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/api/auth/signin" className="flex justify-center">
        <a
          className="rounded-full border border-black bg-black px-4 py-1 text-white"
          href="/api/auth/signin"
        >
          login
        </a>
      </Link>

      <h1>Welcome!</h1>
    </div>
  );
}
