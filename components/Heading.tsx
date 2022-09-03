import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Heading() {
  const router = useRouter();

  const { data: session, status } = useSession();

  const loading = status === "loading";

  if (loading) {
    return null;
  }

  return (
    <header className="flex h-14 px-5 pt-5 pb-2">
      <div className="text-xl">
        {router.asPath === "/" ? (
          <p>Digital Downloads</p>
        ) : (
          <Link href="/">
            <a className="underline">Home</a>
          </Link>
        )}
      </div>

      <div className="ml-10 mt-1 grow"></div>

      {session &&
        (router.asPath === "/dashboard" ? (
          <>
            <div className="mr-3">
              <Link href="/dashboard/sales">
                <a className="underline">See sales</a>
              </Link>
            </div>
            <div className="mr-3">
              <Link href="/dashboard/new">
                <a className="underline">Create a new product</a>
              </Link>
            </div>
            <p className="mr-3 font-bold">Dashboard</p>
          </>
        ) : (
          <Link href="/dashboard">
            <a className="flex">
              <p className="mr-3 underline">Dashboard</p>
            </a>
          </Link>
        ))}
      <a
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className="flex-l rounded-full border px-4 font-bold"
      >
        {session ? "logout" : "login"}
      </a>
    </header>
  );
}
