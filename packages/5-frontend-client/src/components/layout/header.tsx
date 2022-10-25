import { clsx } from 'clsx';
import { ReactNode } from 'react';
import { useMatch } from 'react-router-dom';

import { Link, NavLink } from '~/components/elements/link';
import { useIsFetchingUser, useUser } from '~/hooks/use-user';
import Logo from '~/images/logos/shakala.svg';

import { Avatar } from '../elements/avatar/avatar';
import { SearchParamLink } from '../elements/search-param-link';

type HeaderProps = {
  className?: string;
};

export const Header = ({ className }: HeaderProps): JSX.Element => (
  <header className="links-nocolor bg-inverted pt-6 pb-2 text-inverted">
    <div className={clsx('px-4', className)}>
      <div className="relative flex flex-row justify-between gap-4">
        <Authentication />
        <Heading />
        <Navigation className="mt-auto hidden md:flex" />
      </div>
      <Navigation className="flex md:hidden" />
    </div>
  </header>
);

const Heading = () => (
  <Link to="/" className="row mt-4 items-end gap-4">
    <Logo className="w-12 px-1 !text-white/90" />
    <div>
      <div className="text-xxl font-bold leading-10">Shakala</div>
      <div className="leading-3">Échanges critiques</div>
    </div>
  </Link>
);

const Authentication = () => {
  const user = useUser();
  const fetchingUser = useIsFetchingUser();
  const isProfilePage = useMatch('/profil/*');

  const getNick = () => {
    if (fetchingUser) {
      return null;
    }

    if (!user) {
      return 'Connexion';
    }

    return user.nick;
  };

  return (
    <AuthenticationLink
      loading={fetchingUser}
      authenticated={Boolean(user)}
      className="absolute top-0 right-0 flex flex-row items-center gap-2"
    >
      <span className={clsx('font-bold', isProfilePage && 'text-primary')}>{getNick()}</span>
      <div className="h-6 w-6">
        <Avatar
          size="medium"
          image={user?.profileImage}
          loading={fetchingUser}
          className="h-6 w-6 border-none"
        />
      </div>
    </AuthenticationLink>
  );
};

type AuthenticationLinkProps = {
  loading: boolean;
  authenticated: boolean;
  className?: string;
  children: ReactNode;
};

const AuthenticationLink = ({ loading, authenticated, className, children }: AuthenticationLinkProps) => {
  if (loading) {
    return <div className={className}>{children}</div>;
  }

  if (authenticated) {
    return (
      <Link to="/profil" className={className}>
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
      'whitespace-nowrap font-semibold uppercase text-inverted/90',
      'flex flex-row flex-nowrap items-end justify-between gap-x-2',
      'hide-scrollbars overflow-x-auto',
      'sm:justify-end sm:gap-x-4',
      className,
    )}
  >
    <HeaderNavLink to="" end>
      Accueil
    </HeaderNavLink>
    <HeaderNavLink to="discussions">Discussions</HeaderNavLink>
    <HeaderNavLink to="charte">La charte</HeaderNavLink>
    <HeaderNavLink to="faq">FAQ</HeaderNavLink>
  </nav>
);

const HeaderNavLink = (props: React.ComponentProps<typeof NavLink>) => (
  <NavLink
    className={({ isActive }) =>
      clsx(
        'underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-primary',
        isActive && '!text-primary',
      )
    }
    {...props}
  />
);
