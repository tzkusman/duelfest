'use client';

import { type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { createClient } from '@/lib/supabase/client';

type NavItem = { href: string; label: string; icon: string; key: string };

const NAV: NavItem[] = [
  { key: 'home', href: '/', label: 'Home', icon: 'dashboard' },
  { key: 'arena', href: '/arena', label: 'Arena', icon: 'swords' },
  { key: 'leaderboard', href: '/leaderboard', label: 'Ranks', icon: 'emoji_events' },
  { key: 'profile', href: '/profile', label: 'Profile', icon: 'person' },
];

type Props = {
  children: ReactNode;
  activeTab?: string;
  user: { email?: string | null } | null;
  topBarRight?: ReactNode;
  hideNav?: boolean;
};

export default function MobileShell({
  children,
  activeTab,
  user,
  topBarRight,
  hideNav,
}: Props) {
  const pathname = usePathname() || '/';
  const router = useRouter();

  const resolvedTab =
    activeTab ??
    (NAV.find((n) => {
      if (n.href === '/') return pathname === '/';
      return pathname === n.href || pathname.startsWith(n.href + '/');
    })?.key ?? 'home');

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-[#050505] md:py-6">
      <div
        className={clsx(
          'relative flex w-full max-w-[420px] flex-col bg-background',
          'min-h-screen md:min-h-0 md:h-[860px] md:overflow-hidden',
          'md:rounded-[2.5rem] md:border-[10px] md:border-black md:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]',
        )}
      >
        <div className="pointer-events-none absolute left-1/2 top-0 z-50 hidden h-6 w-32 -translate-x-1/2 items-center justify-center rounded-b-2xl bg-black md:flex">
          <div className="h-1.5 w-1.5 rounded-full bg-surface-container-high" />
        </div>

        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-surface/80 px-margin-mobile py-4 backdrop-blur-xl">
          <Link
            href="/"
            className="font-display-lg-mobile text-display-lg-mobile italic uppercase tracking-tighter text-primary-container"
          >
            DuelFit
          </Link>
          <div className="flex items-center gap-2">
            {topBarRight}
            {user && (
              <button
                onClick={handleSignOut}
                aria-label="Sign out"
                className="rounded-lg border border-white/10 bg-surface-container-highest p-2 text-on-surface-variant transition active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-margin-mobile py-6 pb-28">
          {children}
        </main>

        {!hideNav && (
          <nav className="absolute bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-surface/95 px-2 pb-6 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:rounded-b-[2rem]">
            <div className="flex justify-around">
              {NAV.map((item) => {
                const active = resolvedTab === item.key;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={clsx(
                      'flex flex-col items-center justify-center rounded-xl px-4 py-1 transition-transform duration-200 active:scale-90',
                      active
                        ? 'bg-primary-container/10 text-primary-container'
                        : 'text-on-surface-variant hover:text-primary',
                    )}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={
                        active
                          ? { fontVariationSettings: "'FILL' 1" }
                          : undefined
                      }
                    >
                      {item.icon}
                    </span>
                    <span className="mt-1 font-label-caps text-label-caps">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
