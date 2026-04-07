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
        <div className="grid gap-6 sm:grid-cols-2">
          {streamers.map((streamer) => (
            <article
              key={streamer.name}
              className="relative min-h-56 rounded-xl border border-zinc-800 bg-zinc-900 p-6 pb-20 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-start gap-4">
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
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold">{streamer.name}</h2>

                  {streamer.schedule && (
                    <div className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {streamer.schedule}
                    </div>
                  )}
                </div>
              </div>

              {streamer.bio && (
                <p className="mt-4 mb-8 text-sm text-zinc-400 line-clamp-4">
                  {streamer.bio}
                </p>
              )}

              <a
                href={streamer.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-violet-500"
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

        <div className="mt-12 flex flex-col items-center">
          <p className="text-sm uppercase tracking-wider text-zinc-500">
            Compiled and Promoted by:
          </p>
          <a
            href="https://discord.gg/VnszZzaZ"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-6 transition-colors hover:border-violet-500/50 hover:bg-zinc-900"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full">
              <Image
                src="https://cdn.discordapp.com/icons/1477335952035807444/6d2baf5d2c8d93ea64ed08b837e0ee34.png"
                alt="Vibecoding Bunker"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">Vibecoding Bunker</p>
              <p className="mt-1 text-sm text-zinc-400">Join the community on Discord</p>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}