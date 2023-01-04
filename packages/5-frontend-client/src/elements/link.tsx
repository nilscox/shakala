import { clsx } from 'clsx';
import NextLink from 'next/link';
import { ComponentProps, HTMLProps } from 'react';

import { usePathname } from '~/hooks/use-pathname';

type LinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string;
  openInNewTab?: boolean;
};

export const Link = ({ href, openInNewTab, onClick, children, ...props }: LinkProps) => (
  <NextLink shallow href={href}>
    <a target={openInNewTab ? '_blank' : undefined} {...props}>
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
    if (exact) {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return <Link href={href} className={clsx(className, isActive() && activeClassName)} {...props} />;
};

type ThreadLinkProps = {
  threadId: string;
  commentId?: string;
  className?: string;
  children?: React.ReactNode;
};

export const ThreadLink = ({ threadId, commentId, className, children }: ThreadLinkProps) => (
  <Link href={`/discussions/${threadId}${commentId ? '#' + commentId : ''}`} className={className}>
    {children}
  </Link>
);

export const ExternalLink = ({ children, ...props }: HTMLProps<HTMLAnchorElement>) => (
  <a rel="noreferrer" {...props}>
    {children}
  </a>
);
