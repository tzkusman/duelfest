'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/home';

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus('error');
      return;
    }

    setStatus('sent');
  };

  return (
    <main className="relative mx-auto flex min-h-screen max-w-container-max flex-col px-margin-mobile">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(210,240,0,0.1),transparent_60%)]" />

      <header className="py-6">
        <span className="font-display-lg-mobile text-display-lg-mobile italic uppercase tracking-tighter text-primary-container">
          DuelFit
        </span>
      </header>

      <section className="flex flex-1 flex-col justify-center py-8">
        <div className="glass-card rounded-2xl p-8">
          <h1 className="mb-2 font-display-lg-mobile text-display-lg-mobile italic uppercase tracking-tighter text-primary">
            Sign in
          </h1>
          <p className="mb-6 text-body-md text-on-surface-variant">
            We'll send you a magic link. No passwords.
          </p>

          {status === 'sent' ? (
            <div className="rounded-xl border border-primary-container/30 bg-primary-container/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-primary-container">
                <span className="material-symbols-outlined">mark_email_read</span>
                <span className="font-bold">Check your inbox</span>
              </div>
              <p className="text-sm text-on-surface-variant">
                We sent a sign-in link to{' '}
                <span className="font-bold text-primary">{email}</span>. Click it
                on this device to continue.
              </p>
              <button
                onClick={() => {
                  setStatus('idle');
                  setEmail('');
                }}
                className="mt-4 font-label-caps text-label-caps text-primary-container underline-offset-4 hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-label-caps text-label-caps text-on-surface-variant"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-white/10 bg-surface-container-lowest px-4 py-3 text-body-md text-primary outline-none transition placeholder:text-on-surface-variant/50 focus:border-primary-container focus:ring-2 focus:ring-primary-container/30"
                  autoComplete="email"
                  disabled={status === 'sending'}
                />
              </div>

              {errorMsg && (
                <p className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || !email}
                className="w-full rounded-lg bg-primary-container py-4 font-headline-md text-on-primary-container transition active:scale-95 disabled:opacity-50 glow-lime"
              >
                {status === 'sending' ? 'Sending…' : 'Send magic link'}
              </button>

              <p className="text-center text-xs text-on-surface-variant">
                By continuing you agree to DuelFit's Terms and Privacy Policy.
              </p>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          First time here? A new account is created automatically.
        </p>
      </section>
    </main>
  );
}
