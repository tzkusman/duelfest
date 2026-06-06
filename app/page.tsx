import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import MobileShell from '@/components/mobile/MobileShell';
import ActionButton from '@/components/mobile/ActionButton';
import LinkInput from '@/components/mobile/LinkInput';
import StatTile from '@/components/mobile/StatTile';

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const handle = user?.email?.split('@')[0];

  return (
    <MobileShell
      user={user ? { email: user.email } : null}
      activeTab="home"
      topBarRight={
        user ? (
          <Link
            href="/create"
            className="rounded-lg bg-primary-container px-3 py-1.5 text-sm font-bold text-on-primary-container transition active:scale-95"
          >
            + Create
          </Link>
        ) : (
          <Link
            href="/login"
            className="rounded-lg border border-white/10 bg-surface-container-highest px-3 py-1.5 text-sm font-bold text-primary transition active:scale-95"
          >
            Sign in
          </Link>
        )
      }
    >
      <section className="mb-6 text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-container/30 bg-primary-container/10 px-3 py-1 font-label-caps text-label-caps text-primary-container">
          <span className="size-1.5 rounded-full bg-primary-container animate-pulse-glow" />
          Live now
        </span>
        <h1 className="mb-2 font-display-lg text-display-lg italic uppercase leading-none tracking-tighter text-primary">
          {user ? (
            <>
              Ready to
              <br />
              <span className="text-primary-container text-glow-lime">duel?</span>
            </>
          ) : (
            <>
              Challenge a friend.
              <br />
              <span className="text-primary-container text-glow-lime">
                Stay healthy.
              </span>
            </>
          )}
        </h1>
        <p className="px-4 text-sm text-on-surface-variant">
          {user
            ? `Welcome back${handle ? `, ${handle}` : ''}.`
            : 'Create a 1v1 fitness duel in 10 seconds.'}
        </p>
      </section>

      <section className="mb-6 space-y-3">
        <ActionButton
          href="/create"
          icon="add_box"
          title="Create"
          subtitle="Start a new 1v1 duel"
          accent="lime"
        />
        <ActionButton
          href="/arena"
          icon="swords"
          title="Duel"
          subtitle="Browse open challenges"
          accent="purple"
        />
        <ActionButton
          href="/leaderboard"
          icon="emoji_events"
          title="Win"
          subtitle="Climb the ranks"
          accent="gold"
        />
      </section>

      <section className="mb-6 glass-card rounded-2xl p-4">
        <LinkInput />
      </section>

      <section className="mb-6 flex gap-2">
        <StatTile value="2,482" label="DUELLISTS" accent="lime" href="/arena" />
        <StatTile value="45.5k" label="🪙 POOL" accent="gold" href="/arena" />
        <StatTile value="+12" label="NEW DUELS" accent="purple" href="/arena" />
      </section>

      {!user && (
        <section className="mb-6 text-center">
          <Link
            href="/login"
            className="block w-full rounded-xl bg-primary-container py-4 font-headline-md text-on-primary-container transition active:scale-95 glow-lime"
          >
            Get started — it's free
          </Link>
          <p className="mt-3 text-xs text-on-surface-variant">
            First time? A new account is created automatically.
          </p>
        </section>
      )}

      <footer className="border-t border-white/5 pt-4 text-center font-label-caps text-label-caps text-on-surface-variant">
        © 2026 DuelFit · Built for the brave
      </footer>
    </MobileShell>
  );
}
