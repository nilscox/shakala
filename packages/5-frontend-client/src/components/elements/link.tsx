import { clsx } from 'clsx';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps, HTMLProps } from 'react';

type LinkProps = ComponentProps<typeof NextLink> & {
  openInNewTab?: boolean;
};

export const Link = ({ openInNewTab, href, onClick, ...props }: LinkProps) => {
  return <NextLink prefetch={false} href={href} target={openInNewTab ? '_blank' : undefined} {...props} />;
};

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
