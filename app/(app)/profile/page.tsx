import { createClient } from '@/lib/supabase/server';

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const handle = user?.email?.split('@')[0] || 'athlete';

  return (
    <section className="space-y-4">
      <header className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary-container/15 text-3xl font-bold text-primary-container ring-2 ring-primary-container/40">
          {handle.charAt(0).toUpperCase()}
        </div>
        <h1 className="font-headline-md text-headline-md text-primary">
          @{handle}
        </h1>
        <p className="text-sm text-on-surface-variant">{user?.email}</p>
      </header>

      <div className="glass-card rounded-xl p-4">
        <p className="mb-2 font-label-caps text-label-caps text-on-surface-variant">
          WALLET
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-display-lg-mobile text-3xl text-tertiary-fixed text-glow-gold">
            0
          </span>
          <span className="font-label-caps text-label-caps text-tertiary-fixed">
            COINS
          </span>
        </div>
        <p className="mt-2 text-xs text-on-surface-variant">
          Top up to start dueling. Coming soon.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'WIN RATE', value: '—' },
          { label: 'STREAK', value: '0 d' },
          { label: 'TOTAL WINS', value: '0' },
          { label: 'AVG HR', value: '—' },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-3 text-center">
            <p className="font-headline-md text-xl text-primary">{s.value}</p>
            <p className="font-label-caps text-[10px] text-on-surface-variant">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {[
          { icon: 'wallet', label: 'Wallet & Payouts' },
          { icon: 'notifications', label: 'Notifications' },
          { icon: 'verified_user', label: 'KYC Verification' },
          { icon: 'help', label: 'Help & Support' },
          { icon: 'privacy_tip', label: 'Privacy' },
        ].map((row) => (
          <button
            key={row.label}
            className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-surface-container-low p-3 text-left transition active:scale-[0.99] hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              {row.icon}
            </span>
            <span className="flex-1 text-sm text-primary">{row.label}</span>
            <span className="material-symbols-outlined text-on-surface-variant">
              chevron_right
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
