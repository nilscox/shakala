import classNames from 'classnames';
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
    <div className={classNames('px-4', className)}>
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
      <div className="w-4 h-4 sm:w-6 sm:h-6">
        <Avatar big image={user?.profileImage} className="w-4 h-4 border-none sm:w-6 sm:h-6" />
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
      'text-inverted/90 font-semibold uppercase whitespace-nowrap',
      'flex flex-row flex-nowrap items-end justify-between gap-x-2',
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
      classNames(
        'hover:underline decoration-2 decoration-primary underline-offset-4',
        isActive && '!text-primary',
      )
    }
    {...props}
  />
);
