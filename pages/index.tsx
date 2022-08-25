import Head from "next/head";
import Heading from "../components/Heading";

export default function Home() {
  return (
    <div>
      <Head>
        <title />
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Welcome!</h1>
      <Heading />
      <h1 className="mt-20 flex justify-center text-xl">Welcome!</h1>
    </div>
  );
}
