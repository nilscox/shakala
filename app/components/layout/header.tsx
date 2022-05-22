import { Link, NavLink, NavLinkProps } from '@remix-run/react';
import classNames from 'classnames';
import { ReactNode } from 'react';

import { useUser } from '~/user.provider';

import { Avatar } from '../domain/avatar/avatar';
import { SearchParamLink } from '../elements/search-param-link';

type HeaderProps = {
  className?: string;
};

export const Header = ({ className }: HeaderProps): JSX.Element => (
  <header className="pt-5 pb-2 text-text-white bg-dark links-nocolor">
    <div className={classNames('px-4', className)}>
      <div className="flex relative flex-row gap-4 justify-between pt-3 xs:pt-0">
        <Authentication />
        <Heading />
        <Navigation className="hidden mt-auto sm:flex" />
      </div>
      <Navigation className="flex mt-2 sm:hidden" />
    </div>
  </header>
);

const Heading = () => (
  <Link to="/">
    <div className="text-xxl font-bold">Shakala</div>
    <div>des échanges critiques et bienveillants</div>
  </Link>
);

const Authentication = () => {
  const user = useUser();

  return (
    <AuthenticationLink
      authenticated={Boolean(user)}
      className="flex absolute top-0 right-0 flex-row grow gap-2 items-center"
    >
      <span className="font-bold">{user?.nick ?? 'Connexion'}</span>
      <div className="w-4 h-4 xs:w-5 xs:h-5">
        <Avatar image={user?.image} className="w-4 h-4 border-none xs:w-5 xs:h-5" />
      </div>
    </AuthenticationLink>
  );
};

type AuthenticationLinkProps = {
  authenticated: boolean;
  className?: string;
  children: ReactNode;
};

const AuthenticationLink = ({ authenticated, className, children }: AuthenticationLinkProps) => {
  if (authenticated) {
    return (
      <Link to="/profile" className={className}>
        {children}
      </Link>
    );
  }

  return (
    <SearchParamLink param="auth" value="login" className={className}>
      {children}
    </SearchParamLink>
  );
};

type NavigationProps = {
  className?: string;
};

const Navigation = ({ className }: NavigationProps) => (
  <nav
    className={classNames(
      'text-text-white/90 font-semibold uppercase whitespace-nowrap',
      'flex flex-col flex-wrap items-end justify-between gap-y-0.5',
      'xxs:gap-x-2 xxs:flex-row',
      'xs:gap-x-3 xs:flex-nowrap xs:justify-end',
      'md:gap-x-4',
      className,
    )}
  >
    <HeaderNavLink to="/">Accueil</HeaderNavLink>
    <HeaderNavLink to="/discussions">Discussions</HeaderNavLink>
    <HeaderNavLink to="/charte">La charte</HeaderNavLink>
    <HeaderNavLink to="/faq">FAQ</HeaderNavLink>
  </nav>
);

const HeaderNavLink = (props: NavLinkProps) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <NavLink
    prefetch="intent"
    className={({ isActive }) =>
      classNames(
        'hover:text-text-white border-b-2 border-transparent hover:border-b-primary',
        isActive && '!text-primary',
      )
    }
    {...props}
  />
);
