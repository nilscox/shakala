import { clsx } from 'clsx';
import { ReactNode } from 'react';

import { NavLink, Link } from '~/components/elements/link';
import { useUser } from '~/hooks/use-user';

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
      <Navigation className="mt-2 flex md:hidden" />
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
      className="absolute top-0 right-0 flex flex-row items-center gap-2"
    >
      <span className="font-bold">{user?.nick ?? 'Connexion'}</span>
      <div className="h-6 w-6">
        <Avatar size="medium" image={user?.profileImage} className="h-6 w-6 border-none" />
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
    <HeaderNavLink to="/">Accueil</HeaderNavLink>
    <HeaderNavLink to="/discussions">Discussions</HeaderNavLink>
    <HeaderNavLink to="/charte">La charte</HeaderNavLink>
    <HeaderNavLink to="/faq">FAQ</HeaderNavLink>
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
