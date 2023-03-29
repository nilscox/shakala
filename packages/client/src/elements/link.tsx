import { clsx } from 'clsx';
import { ComponentProps, HTMLProps } from 'react';

import { usePathname } from '../hooks/use-pathname';

type LinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string;
  openInNewTab?: boolean;
};

export const Link = ({ href, openInNewTab, onClick, children, ...props }: LinkProps) => (
  // eslint-disable-next-line react/jsx-no-target-blank
  <a href={href} target={openInNewTab ? '_blank' : undefined} {...props}>
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
  const searchParams = new URLSearchParams();

  if (disabled) {
    return <span aria-disabled {...props} />;
  }

  searchParams.set(param, value);

  return <Link href={[pathname, searchParams].join('?')} {...props} />;
};

export const ExternalLink = ({ children, ...props }: HTMLProps<HTMLAnchorElement>) => (
  <a rel="noreferrer" {...props}>
    {children}
  </a>
);
