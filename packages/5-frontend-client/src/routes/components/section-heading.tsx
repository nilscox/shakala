import clsx from 'clsx';
import { HTMLProps } from 'react';

type SectionHeadingProps = HTMLProps<HTMLHeadingElement>;

export const SectionHeading = ({ className, children, ...props }: SectionHeadingProps) => (
  <h2 className={clsx('mt-4 text-lg font-bold text-muted', className)} {...props}>
    {children}
  </h2>
);
