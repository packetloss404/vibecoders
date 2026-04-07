import Image from "next/image";
import { streamers } from "./data/streamers";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800 px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold">Vibe Coders</h1>
          <p className="mt-2 text-zinc-400">Streamers who code with good vibes</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {streamers.map((streamer) => (
            <article
              key={streamer.name}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-center gap-4">
                {streamer.avatarUrl && (
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={streamer.avatarUrl}
                      alt={streamer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h2 className="text-xl font-semibold">{streamer.name}</h2>
              </div>

              {streamer.bio && (
                <p className="mt-4 text-sm text-zinc-400 line-clamp-3">
                  {streamer.bio}
                </p>
              )}

              {streamer.schedule && (
                <div className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {streamer.schedule}
                </div>
              )}

              <a
                href={streamer.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-violet-500"
              >
                Watch
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}