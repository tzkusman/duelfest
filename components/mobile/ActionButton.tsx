import Link from 'next/link';
import clsx from 'clsx';

type Accent = 'lime' | 'purple' | 'gold';

const accentMap: Record<
  Accent,
  { ring: string; bg: string; text: string; glow: string }
> = {
  lime: {
    ring: 'ring-primary-container/40',
    bg: 'bg-primary-container/15',
    text: 'text-primary-container',
    glow: 'group-hover:shadow-[0_0_30px_rgba(210,240,0,0.35)]',
  },
  purple: {
    ring: 'ring-secondary-container/40',
    bg: 'bg-secondary-container/15',
    text: 'text-secondary-container',
    glow: 'group-hover:shadow-[0_0_30px_rgba(182,0,248,0.35)]',
  },
  gold: {
    ring: 'ring-tertiary-fixed/40',
    bg: 'bg-tertiary-fixed/15',
    text: 'text-tertiary-fixed',
    glow: 'group-hover:shadow-[0_0_30px_rgba(255,225,109,0.35)]',
  },
};

type Props = {
  href: string;
  icon: string;
  title: string;
  subtitle: string;
  accent: Accent;
  trailing?: string;
};

export default function ActionButton({
  href,
  icon,
  title,
  subtitle,
  accent,
  trailing = 'chevron_right',
}: Props) {
  const a = accentMap[accent];
  return (
    <Link
      href={href}
      className={clsx(
        'group glass-card relative flex items-center gap-4 overflow-hidden rounded-2xl p-4 transition-all',
        'active:scale-[0.98] hover:border-white/20 hover:bg-white/[0.08]',
        a.glow,
      )}
    >
      <div
        className={clsx(
          'flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl ring-2',
          a.bg,
          a.ring,
        )}
      >
        <span className={clsx('material-symbols-outlined text-3xl', a.text)}>
          {icon}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-headline-md text-xl font-bold leading-tight text-primary">
          {title}
        </h3>
        <p className="truncate text-sm text-on-surface-variant">{subtitle}</p>
      </div>
      <span className="material-symbols-outlined flex-shrink-0 text-on-surface-variant transition-transform group-hover:translate-x-1">
        {trailing}
      </span>
    </Link>
  );
}
