import { ComponentProps, HTMLProps, MouseEventHandler } from 'react';
import { Link as RRLink, NavLink as RRNavLink, To } from 'react-router-dom';

type LinkProps = ComponentProps<typeof RRLink> & {
  openInNewTab?: boolean;
};

export const Link = ({ openInNewTab, to, onClick, ...props }: LinkProps) => {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);

    const hash = getHashFragment(to);

    if (!hash) {
      return;
    }

    const scrollToElement = (tryCount = 0) => {
      const el = document.getElementById(hash);

      if (el) {
        el.scrollIntoView();
      } else if (tryCount < 10) {
        setTimeout(() => scrollToElement(tryCount + 1), 100);
      }
    };

    setTimeout(scrollToElement, 0);
  };

  return <RRLink to={to} onClick={handleClick} target={openInNewTab ? '_blank' : undefined} {...props} />;
};

const getHashFragment = (to: To) => {
  if (typeof to === 'object') {
    return to.hash;
  }

  if (!to.includes('#')) {
    return;
  }

  return to.replace(/.*#/, '');
};

export const NavLink = RRNavLink;

export const ExternalLink = ({ children, ...props }: HTMLProps<HTMLAnchorElement>) => (
  <a {...props}>{children}</a>
);
