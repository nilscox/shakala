import clsx from 'clsx';
import { HTMLProps } from 'react';

type PageTitleProps = HTMLProps<HTMLHeadingElement>;

export const PageTitle = ({ className, children, ...props }: PageTitleProps) => (
  <h2 className={clsx('my-6 text-xl', className)} {...props}>
    {children}
  </h2>
);
