import { clsx } from 'clsx';

type ChipProps = {
  className?: string;
  children: React.ReactNode;
};

export const Chip = ({ className, children }: ChipProps) => (
  <span
    // eslint-disable-next-line tailwindcss/no-arbitrary-value
    className={clsx(
      'col h-[1.25rem] w-[1.25rem] items-center justify-center rounded-full bg-primary text-sm font-semibold text-white',
      className,
    )}
  >
    {children}
  </span>
);
