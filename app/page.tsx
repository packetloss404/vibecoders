import Image from "next/image";
import { streamers } from "./data/streamers";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-zinc-50">
      <header className="border-b border-zinc-800/50 bg-gradient-to-r from-[#0f0f0f] via-zinc-900 to-[#0f0f0f] px-6 py-6">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Vibe Coders
            </span>
          </h1>
          <p className="mt-2 text-base text-zinc-400">
            Streamers who code with good vibes
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {streamers.map((streamer) => (
            <article
              key={streamer.name}
              className="group relative min-h-56 overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/80 p-6 pb-16 backdrop-blur-sm transition-all hover:border-zinc-700/50 hover:bg-zinc-900"
            >
              <div className="flex items-start gap-4">
                {streamer.avatarUrl && (
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-zinc-800 transition-all group-hover:ring-teal-500/50">
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
                      <svg className="h-4 w-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {streamer.schedule}
                    </div>
                  )}
                </div>
              </div>

              {streamer.bio && (
                <p className="mt-4 mb-6 text-sm text-zinc-400 line-clamp-4">
                  {streamer.bio}
                </p>
              )}

              <a
                href={streamer.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2 text-sm font-medium text-black transition-all hover:from-teal-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-teal-500/20"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Watch
              </a>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center">
          <p className="text-sm uppercase tracking-wider text-zinc-500">
            Compiled and Promoted by:
          </p>
          <a
            href="https://discord.gg/VnszZzaZ"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-zinc-800/50 bg-zinc-900/80 px-8 py-6 backdrop-blur-sm transition-all hover:border-teal-500/30 hover:bg-zinc-900"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-zinc-800 transition-all hover:ring-teal-500/30">
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