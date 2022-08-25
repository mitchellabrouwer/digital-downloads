import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";

  const [name, setName] = useState("");

  if (!session || !session.user) {
    return null;
  }

  if (loading) {
    return null;
  }

  if (!loading && session.user.name) {
    router.push("/dashboard");
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        await fetch("/api/setup", {
          body: JSON.stringify({
            name,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        session.user.name = name;
        router.push("/dashboard");
      }}
      className="mt-10 text-center"
    >
      <h1 className="mt-20 flex justify-center text-xl">Welcome!</h1>

      <div className="mb-5 mt-20 flex-1">
        <div className="mb-5 flex-1">Please enter your name</div>
        <input
          type="text"
          name="name"
          onChange={(event) => setName(event.target.value)}
          className="border p-1 text-black"
          required
        />
      </div>

      <button
        type="button"
        className="mt-0 border px-8 py-2 font-bold hover:bg-white hover:text-black"
      >
        Save
      </button>
    </form>
  );
}
