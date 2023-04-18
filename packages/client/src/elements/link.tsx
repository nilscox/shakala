import { clsx } from 'clsx';
import { ComponentProps, HTMLProps } from 'react';

import { usePathname, useSearchParams } from '../hooks/use-router';

type LinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string;
  openInNewTab?: boolean;
  keepScrollPosition?: boolean;
};

export const Link = ({ href, openInNewTab, children, keepScrollPosition, ...props }: LinkProps) => (
  // eslint-disable-next-line react/jsx-no-target-blank
  <a
    href={href}
    target={openInNewTab ? '_blank' : undefined}
    // eslint-disable-next-line react/no-unknown-property
    keep-scroll-position={keepScrollPosition ? 'true' : undefined}
    {...props}
  >
    {children}
  </a>
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

type SearchParamLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  param: string;
  value: string;
  disabled?: boolean;
};

export const SearchParamLink = ({ param, value, disabled, ...props }: SearchParamLinkProps) => {
  const pathname = usePathname();
  const searchParams = new URLSearchParams(useSearchParams());

  if (disabled) {
    return <span aria-disabled {...props} />;
  }

  searchParams.set(param, value);

  return <Link keepScrollPosition href={[pathname, searchParams].join('?')} {...props} />;
};

type ExternalLinkProps = HTMLProps<HTMLAnchorElement> & {
  openInNewTab?: boolean;
};

export const ExternalLink = ({ openInNewTab, children, ...props }: ExternalLinkProps) => (
  <a rel="external noreferrer" target={openInNewTab ? '_blank' : undefined} {...props}>
    {children}
  </a>
);
