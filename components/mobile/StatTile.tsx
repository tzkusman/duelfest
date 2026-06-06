import clsx from 'clsx';

type Accent = 'lime' | 'purple' | 'gold';

const accentMap: Record<Accent, string> = {
  lime: 'text-primary-container',
  purple: 'text-secondary-container',
  gold: 'text-tertiary-fixed',
};

type Props = {
  value: string;
  label: string;
  accent?: Accent;
  href?: string;
};

export default function StatTile({ value, label, accent = 'lime', href }: Props) {
  const inner = (
    <div className="glass-card flex-1 rounded-xl p-3 text-center transition active:scale-95">
      <p className={clsx('font-headline-md text-xl font-bold', accentMap[accent])}>
        {value}
      </p>
      <p className="font-label-caps text-[10px] text-on-surface-variant">{label}</p>
    </div>
  );
  if (href) {
    return (
      <a href={href} className="flex-1">
        {inner}
      </a>
    );
  }
  return inner;
}
