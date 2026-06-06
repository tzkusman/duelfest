import Link from 'next/link';
import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import MobileShell from '@/components/mobile/MobileShell';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <MobileShell
      user={{ email: user.email }}
      topBarRight={
        <Link
          href="/create"
          className="rounded-lg bg-primary-container px-3 py-1.5 text-sm font-bold text-on-primary-container transition active:scale-95"
        >
          + Create
        </Link>
      }
    >
      {children}
    </MobileShell>
  );
}
