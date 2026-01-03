import Link from "next/link";
import { HomeSearchTrigger } from "@/components/search/HomeSearchTrigger";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-8 md:p-24 relative overflow-hidden">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm flex flex-col">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent pb-2">
          Muslim Adhkar
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-center max-w-2xl text-muted-foreground">
          Authentic Adhkar, Duas, and Hadith references for your spiritual journey.
        </p>

        <HomeSearchTrigger />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left">
          <Link
            href="/adhkar"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Adhkar{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Daily remembrances including Morning and Evening Adhkar.
            </p>
          </Link>

          <Link
            href="/duas"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Duas{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Supplications categorized for various occasions.
            </p>
          </Link>

          <Link
            href="/sources"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Sources{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              References and authorities for the content.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
