type Rank = {
  rank: number;
  handle: string;
  wins: number;
  earnings: number;
  badge: 'gold' | 'purple' | 'lime';
};

const TOP: Rank[] = [
  { rank: 1, handle: 'apex_runner', wins: 47, earnings: 124000, badge: 'gold' },
  { rank: 2, handle: 'shadow_boxer', wins: 41, earnings: 98500, badge: 'purple' },
  { rank: 3, handle: 'iron_lungs', wins: 38, earnings: 88200, badge: 'lime' },
  { rank: 4, handle: 'thunder_knee', wins: 31, earnings: 71500, badge: 'lime' },
  { rank: 5, handle: 'silent_strike', wins: 28, earnings: 62000, badge: 'lime' },
];

const badgeColor = {
  gold: 'text-tertiary-fixed text-glow-gold',
  purple: 'text-secondary-container',
  lime: 'text-primary-container',
};

export default function LeaderboardPage() {
  return (
    <section className="space-y-4">
      <header className="text-center">
        <span className="mb-2 inline-block rounded-full bg-tertiary-fixed/10 px-3 py-1 font-label-caps text-label-caps text-tertiary-fixed">
          WEEKLY RANKINGS
        </span>
        <h1 className="font-headline-md text-headline-md text-primary">
          Top Duellists
        </h1>
      </header>

      <div className="flex gap-2">
        {(['WEEK', 'MONTH', 'ALL-TIME'] as const).map((tab, i) => (
          <button
            key={tab}
            className={`flex-1 rounded-lg py-2 font-label-caps text-label-caps transition active:scale-95 ${
              i === 0
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-highest text-on-surface-variant'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <ol className="space-y-2">
        {TOP.map((r) => (
          <li
            key={r.handle}
            className="glass-card flex items-center gap-4 rounded-xl p-4"
          >
            <span className={`w-8 text-center font-display-lg-mobile text-2xl ${badgeColor[r.badge]}`}>
              #{r.rank}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest font-bold text-primary-container">
              {r.handle.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-primary">@{r.handle}</p>
              <p className="font-label-caps text-[10px] text-on-surface-variant">
                {r.wins} WINS
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-tertiary-fixed">
                {(r.earnings / 100).toLocaleString()} 🪙
              </p>
              <p className="font-label-caps text-[10px] text-on-surface-variant">
                EARNED
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
