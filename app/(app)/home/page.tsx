import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <section className="space-y-6">
      <div className="glass-card rounded-xl p-8 glow-gold">
        <p className="mb-2 font-label-caps text-label-caps text-on-surface-variant">
          AVAILABLE BALANCE
        </p>
        <div className="flex items-baseline gap-3">
          <h1 className="font-display-lg text-display-lg text-tertiary-fixed-dim text-glow-gold">
            0
          </h1>
          <span className="font-headline-md text-headline-md italic text-tertiary-fixed">
            COINS
          </span>
        </div>
        <p className="mt-2 text-sm text-on-surface-variant">
          Wallet is being initialized. Add funds to start dueling.
        </p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="mb-2 font-headline-md text-headline-md text-primary">
          Welcome, athlete
        </h2>
        <p className="text-on-surface-variant">
          Signed in as <span className="text-primary">{user.email}</span>.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Win Rate', value: '—' },
          { label: 'Streak', value: '0 d' },
          { label: 'Avg HR', value: '—' },
          { label: 'Calories', value: '0' },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <p className="font-label-caps text-[10px] text-on-surface-variant">
              {s.label.toUpperCase()}
            </p>
            <p className="font-headline-md text-headline-md text-primary">
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
