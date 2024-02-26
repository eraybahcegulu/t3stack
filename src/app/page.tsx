import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "app/app/_components/create-post";
import { getServerAuthSession } from "app/server/auth";
import { api } from "app/trpc/server";

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">

    </main>
  );
}
