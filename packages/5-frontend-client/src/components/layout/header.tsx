import clsx from 'clsx';
import { ReactNode } from 'react';
import { Link, NavLink, NavLinkProps } from 'react-router-dom';

import { useUser } from '~/hooks/use-user';

import { Avatar } from '../elements/avatar/avatar';
import { SearchParamLink } from '../elements/search-param-link';

type HeaderProps = {
  className?: string;
};

export const Header = ({ className }: HeaderProps): JSX.Element => (
  <header className="pt-6 pb-2 text-inverted bg-inverted links-nocolor">
    <div className={clsx('px-4', className)}>
      <div className="flex relative flex-row gap-4 justify-between">
        <Authentication />
        <Heading />
        <Navigation className="hidden mt-auto md:flex" />
      </div>
      <Navigation className="flex mt-2 md:hidden" />
    </div>
  </header>
);

const Heading = () => (
  <Link to="/">
    <div className="text-xxl font-bold">Shakala</div>
    <div>Échanges critiques et bienveillants</div>
  </Link>
);

const Authentication = () => {
  const user = useUser();

  return (
    <AuthenticationLink
      authenticated={Boolean(user)}
      className="flex absolute top-0 right-0 flex-row gap-2 items-center"
    >
      <span className="font-bold">{user?.nick ?? 'Connexion'}</span>
      <div className="w-6 h-6">
        <Avatar big image={user?.profileImage} className="w-6 h-6 border-none" />
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
    className={clsx(
      'font-semibold text-inverted/90 uppercase whitespace-nowrap',
      'flex flex-row flex-nowrap gap-x-2 justify-between items-end',
      'overflow-x-auto hide-scrollbars',
      'sm:gap-x-4 sm:justify-end',
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
  <NavLink
    className={({ isActive }) =>
      clsx('hover:underline decoration-primary decoration-2 underline-offset-4', isActive && '!text-primary')
    }
    {...props}
  />
);
