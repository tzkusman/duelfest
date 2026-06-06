'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LinkInput() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = value.trim();
    if (!trimmed) return;

    let token: string | null = null;

    try {
      if (/^https?:\/\//i.test(trimmed)) {
        const url = new URL(trimmed);
        const match = url.pathname.match(/\/d\/([A-Za-z0-9_-]+)/);
        if (match) token = match[1];
      } else {
        const match = trimmed.match(/\/d\/([A-Za-z0-9_-]+)/);
        if (match) {
          token = match[1];
        } else if (/^[A-Za-z0-9_-]{6,}$/.test(trimmed)) {
          token = trimmed;
        }
      }
    } catch {
      setError('Invalid link format');
      return;
    }

    if (!token) {
      setError("Couldn't find a duel token in that link");
      return;
    }

    router.push(`/d/${token}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label
        htmlFor="duel-link"
        className="block font-label-caps text-label-caps text-on-surface-variant"
      >
        HAVE A DUEL LINK?
      </label>
      <div className="flex gap-2">
        <input
          id="duel-link"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste link or token…"
          className="flex-1 rounded-lg border border-white/10 bg-surface-container-lowest px-4 py-3 text-sm text-primary outline-none transition placeholder:text-on-surface-variant/50 focus:border-primary-container focus:ring-2 focus:ring-primary-container/30"
        />
        <button
          type="submit"
          className="rounded-lg border border-white/10 bg-surface-container-high px-4 py-3 font-bold text-primary transition active:scale-95"
        >
          Go
        </button>
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </form>
  );
}
