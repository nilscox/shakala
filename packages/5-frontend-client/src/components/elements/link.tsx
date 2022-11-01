import { clsx } from 'clsx';
import NextLink from 'next/link';
import { ComponentProps, HTMLProps } from 'react';

import { usePathname } from '../../hooks/use-pathname';

type LinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string;
  openInNewTab?: boolean;
};

export const Link = ({ href, openInNewTab, onClick, children, ...props }: LinkProps) => (
  <NextLink prefetch={false} href={href}>
    <a target={openInNewTab ? '_blank' : undefined} rel="noreferrer" {...props}>
      {children}
    </a>
  </NextLink>
);

type NavLinkProps = LinkProps & {
  activeClassName: string;
  exact?: boolean;
};

export const NavLink = ({ href, className, activeClassName, exact, ...props }: NavLinkProps) => {
  const pathname = usePathname();

  const isActive = () => {
    return href.toString() === pathname;
  };

  return <Link href={href} className={clsx(className, isActive() && activeClassName)} {...props} />;
};

export const ExternalLink = ({ children, ...props }: HTMLProps<HTMLAnchorElement>) => (
  <a {...props}>{children}</a>
);
