export default function ArenaPage() {
  return (
    <section className="space-y-4">
      <div>
        <span className="mb-2 inline-block rounded-full bg-primary-container/10 px-3 py-1 font-label-caps text-label-caps text-primary-container">
          LIVE ARENA
        </span>
        <h1 className="font-headline-md text-headline-md text-primary">
          Active Challenges
        </h1>
      </div>

      <div className="glass-card flex gap-4 overflow-x-auto p-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            ONLINE
          </span>
          <span className="font-bold text-primary">2,482 Duellists</span>
        </div>
        <div className="w-px self-center bg-white/10 h-8" />
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            PRIZE POOL
          </span>
          <span className="font-bold text-primary">45.5k 🪙</span>
        </div>
        <div className="w-px self-center bg-white/10 h-8" />
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            NEW DUELS
          </span>
          <span className="font-bold text-primary-container">+12 Added</span>
        </div>
      </div>

      <div className="space-y-3">
        {[
          {
            tag: 'LIVE',
            tagColor: 'bg-primary-container text-on-primary-container',
            icon: 'bolt',
            title: '300 Pushups',
            pool: '2,500 🪙 Pool',
            body: 'Complete 300 reps in under 24 hours.',
            entry: '50 🪙',
            accent: 'lime',
          },
          {
            tag: 'ENDURANCE',
            tagColor: 'bg-secondary-container text-on-secondary-container',
            icon: 'directions_run',
            title: '5km City Run',
            pool: '5,000 🪙 Pool',
            body: 'Fastest pace wins the grand prize.',
            entry: '100 🪙',
            accent: 'purple',
          },
          {
            tag: 'POWERLIFT',
            tagColor: 'bg-white/10 text-white',
            icon: 'fitness_center',
            title: 'Deadlift King',
            pool: '10,000 🪙 Pool',
            body: 'Max relative weight lifted. Video proof required.',
            entry: '500 🪙',
            accent: 'gold',
          },
        ].map((c) => (
          <article
            key={c.title}
            className="glass-card overflow-hidden rounded-2xl transition active:scale-[0.99]"
          >
            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 font-label-caps text-[10px] ${c.tagColor}`}
                >
                  {c.tag}
                </span>
                <h3 className="font-headline-md text-lg font-bold text-primary">
                  {c.title}
                </h3>
              </div>
              <span className="font-bold text-primary-container">{c.pool}</span>
            </div>
            <p className="px-4 py-2 text-sm text-on-surface-variant">{c.body}</p>
            <div className="flex items-center justify-between border-t border-white/5 p-4">
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                ENTRY · {c.entry}
              </span>
              <button className="rounded-lg bg-primary-container px-4 py-2 text-sm font-bold text-on-primary-container transition active:scale-95">
                Join Duel
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
