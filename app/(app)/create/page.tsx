'use client';

import { useState } from 'react';

type Template = {
  id: string;
  title: string;
  description: string;
  metric: 'reps' | 'duration' | 'distance' | 'steps';
  target: number;
  durationMin: number;
  icon: string;
};

const TEMPLATES: Template[] = [
  {
    id: 'pushups-10',
    title: '10 Pushups in 10 min',
    description: 'Quick reps, must be verified by camera.',
    metric: 'reps',
    target: 10,
    durationMin: 10,
    icon: 'fitness_center',
  },
  {
    id: 'run-5k',
    title: '5 km City Run',
    description: 'Fastest pace wins. GPS required.',
    metric: 'distance',
    target: 5,
    durationMin: 60,
    icon: 'directions_run',
  },
  {
    id: 'plank-2',
    title: '2 min Plank Hold',
    description: 'Single continuous hold. Video proof.',
    metric: 'duration',
    target: 120,
    durationMin: 15,
    icon: 'self_improvement',
  },
  {
    id: 'burpees-100',
    title: '100 Burpees',
    description: 'As fast as you can. Form must be visible.',
    metric: 'reps',
    target: 100,
    durationMin: 30,
    icon: 'whatshot',
  },
];

const WAGERS = [50, 100, 250, 500, 1000];

export default function CreateDuelPage() {
  const [step, setStep] = useState<'pick' | 'tune' | 'share'>('pick');
  const [template, setTemplate] = useState<Template | null>(null);
  const [wager, setWager] = useState(100);
  const [custom, setCustom] = useState({
    title: '',
    description: '',
    target: 10,
    durationMin: 10,
  });

  const prizePool = wager * 2;

  if (step === 'pick' && !template) {
    return (
      <section className="space-y-4">
        <header>
          <span className="mb-2 inline-block rounded-full bg-primary-container/10 px-3 py-1 font-label-caps text-label-caps text-primary-container">
            NEW DUEL
          </span>
          <h1 className="font-headline-md text-headline-md text-primary">
            Pick a challenge
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Choose a template or build a custom one.
          </p>
        </header>

        <div className="space-y-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTemplate(t);
                setStep('tune');
              }}
              className="glass-card flex w-full items-center gap-4 rounded-2xl p-4 text-left transition active:scale-[0.98] hover:bg-white/[0.08]"
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary-container/15 ring-2 ring-primary-container/40">
                <span className="material-symbols-outlined text-2xl text-primary-container">
                  {t.icon}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-primary">{t.title}</p>
                <p className="truncate text-sm text-on-surface-variant">
                  {t.description}
                </p>
                <p className="mt-1 font-label-caps text-[10px] text-on-surface-variant">
                  {t.target} {t.metric.toUpperCase()} · {t.durationMin} MIN
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">
                chevron_right
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            setTemplate({
              id: 'custom',
              title: 'Custom duel',
              description: 'Define your own challenge',
              metric: 'reps',
              target: 10,
              durationMin: 10,
              icon: 'edit',
            })
          }
          className="w-full rounded-2xl border border-dashed border-white/20 bg-transparent p-4 text-on-surface-variant transition active:scale-[0.98]"
        >
          + Build a custom duel
        </button>
      </section>
    );
  }

  if (step === 'tune') {
    const isCustom = template?.id === 'custom';
    return (
      <section className="space-y-5">
        <header>
          <button
            onClick={() => {
              setTemplate(null);
              setStep('pick');
            }}
            className="mb-2 font-label-caps text-label-caps text-on-surface-variant"
          >
            ← Back
          </button>
          <h1 className="font-headline-md text-headline-md text-primary">
            Set the terms
          </h1>
        </header>

        {isCustom ? (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
                TITLE
              </label>
              <input
                value={custom.title}
                onChange={(e) => setCustom({ ...custom, title: e.target.value })}
                placeholder="e.g. 50 Squats in 5 min"
                className="w-full rounded-lg border border-white/10 bg-surface-container-lowest px-4 py-3 text-sm text-primary outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/30"
              />
            </div>
            <div>
              <label className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
                DESCRIPTION
              </label>
              <textarea
                value={custom.description}
                onChange={(e) =>
                  setCustom({ ...custom, description: e.target.value })
                }
                placeholder="Rules, proof requirements, etc."
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-surface-container-lowest px-4 py-3 text-sm text-primary outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
                  TARGET
                </label>
                <input
                  type="number"
                  min={1}
                  value={custom.target}
                  onChange={(e) =>
                    setCustom({ ...custom, target: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-lg border border-white/10 bg-surface-container-lowest px-4 py-3 text-sm text-primary outline-none focus:border-primary-container"
                />
              </div>
              <div>
                <label className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
                  DURATION (MIN)
                </label>
                <input
                  type="number"
                  min={1}
                  value={custom.durationMin}
                  onChange={(e) =>
                    setCustom({
                      ...custom,
                      durationMin: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-surface-container-lowest px-4 py-3 text-sm text-primary outline-none focus:border-primary-container"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-4">
            <div className="mb-2 flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-primary-container">
                {template?.icon}
              </span>
              <div>
                <p className="font-bold text-primary">{template?.title}</p>
                <p className="text-xs text-on-surface-variant">
                  {template?.description}
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-between font-label-caps text-label-caps text-on-surface-variant">
              <span>{template?.target} {template?.metric.toUpperCase()}</span>
              <span>{template?.durationMin} MIN</span>
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant">
            WAGER PER PLAYER
          </label>
          <div className="grid grid-cols-5 gap-2">
            {WAGERS.map((w) => (
              <button
                key={w}
                onClick={() => setWager(w)}
                className={`rounded-lg py-2 text-sm font-bold transition active:scale-95 ${
                  wager === w
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-highest text-primary'
                }`}
              >
                {w}🪙
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-primary-container/20 bg-primary-container/5 p-3">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              PRIZE POOL
            </span>
            <span className="font-headline-md text-xl font-bold text-primary-container text-glow-lime">
              {prizePool.toLocaleString()} 🪙
            </span>
          </div>
        </div>

        <button
          onClick={() => setStep('share')}
          disabled={isCustom && !custom.title}
          className="w-full rounded-xl bg-primary-container py-4 font-headline-md text-on-primary-container transition active:scale-95 disabled:opacity-50 glow-lime"
        >
          Lock in & get link
        </button>
      </section>
    );
  }

  // step === 'share' — stub for M3
  return (
    <section className="space-y-4 text-center">
      <div className="glass-card rounded-2xl p-6 glow-lime">
        <span className="material-symbols-outlined mx-auto mb-2 text-5xl text-primary-container">
          check_circle
        </span>
        <h1 className="mb-2 font-headline-md text-headline-md text-primary">
          Duel ready
        </h1>
        <p className="mb-4 text-sm text-on-surface-variant">
          Share this link with your friend. {prizePool.toLocaleString()} 🪙 pot.
        </p>
        <div className="rounded-lg border border-white/10 bg-surface-container-lowest p-3 font-mono text-xs text-primary-container break-all">
          https://duelfit.app/d/preview_{Math.random().toString(36).slice(2, 10)}
        </div>
        <button
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.share) {
              navigator.share({
                title: 'DuelFit Challenge',
                text: 'I just challenged you. Accept and win coins.',
                url: 'https://duelfit.app',
              });
            } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
              navigator.clipboard.writeText('https://duelfit.app/d/preview');
            }
          }}
          className="mt-4 w-full rounded-xl bg-primary-container py-3 font-headline-md text-on-primary-container transition active:scale-95"
        >
          Share link
        </button>
      </div>
      <p className="font-label-caps text-label-caps text-on-surface-variant">
        Real link generation lands in M3 (Supabase + share tokens)
      </p>
    </section>
  );
}
