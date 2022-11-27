import { clsx } from 'clsx';
import { notificationSelectors } from 'frontend-domain';

import { Avatar } from '~/elements/avatar/avatar';
import { Chip } from '~/elements/chip';
import { Link, NavLink } from '~/elements/link';
import { SearchParamLink } from '~/elements/search-param-link';
import { useAppSelector } from '~/hooks/use-app-selector';
import { useUser } from '~/hooks/use-user';
import Logo from '~/images/logo.svg';

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
  <Link href="/" className="row mt-4 items-end gap-4">
    <Logo className="text-inverted aspect-auto" width={64} height={undefined} />
    <div>
      <div className="text-xxl font-bold leading-10">Shakala</div>
      <div className="leading-3">Échanges critiques</div>
    </div>
  </Link>
);

const Authentication = () => {
  const user = useUser();

  const getNick = () => {
    if (!user) {
      return 'Connexion';
    }

    return user.nick;
  };

  return (
    <AuthenticationLink
      authenticated={Boolean(user)}
      className="absolute top-0 right-0 flex flex-row items-center gap-2"
    >
      <span className={clsx('font-bold')}>{getNick()}</span>
      <div className="relative h-6 w-6">
        <Avatar size="medium" image={user?.profileImage} className="h-6 w-6 border-none" />
        {user && <UnseenNotificationsChip />}
      </div>
    </AuthenticationLink>
  );
};

type AuthenticationLinkProps = {
  authenticated: boolean;
  className?: string;
  children: React.ReactNode;
};

const AuthenticationLink = ({ authenticated, className, children }: AuthenticationLinkProps) => {
  if (authenticated) {
    return (
      <NavLink href="/profil" className={className} activeClassName="!text-primary">
        {children}
      </NavLink>
    );
  }

  return (
    <SearchParamLink param="auth" value="login" className={className}>
      {children}
    </SearchParamLink>
  );
};

const UnseenNotificationsChip = () => {
  const total = useAppSelector(notificationSelectors.totalUnseen);

  if (total === 0) {
    return null;
  }

  return <Chip className="absolute -top-1 -right-1 animate-scale-in">{total}</Chip>;
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
    <HeaderNavLink href="/" exact>
      Accueil
    </HeaderNavLink>
    <HeaderNavLink href="/discussions">Discussions</HeaderNavLink>
    <HeaderNavLink href="/charte">La charte</HeaderNavLink>
    <HeaderNavLink href="/faq">FAQ</HeaderNavLink>
  </nav>
);

type HeaderNavLinkProps = {
  href: string;
  exact?: boolean;
  children: React.ReactNode;
};

const HeaderNavLink = (props: HeaderNavLinkProps) => (
  <NavLink
    className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-primary"
    activeClassName="!text-primary"
    {...props}
  />
);
