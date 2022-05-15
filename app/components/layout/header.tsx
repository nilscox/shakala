import { Link, NavLink, NavLinkProps } from '@remix-run/react';
import classNames from 'classnames';

import { Avatar } from '../domain/avatar/avatar';
import { SearchParamLink } from '../elements/search-param-link';

type HeaderProps = {
  className?: string;
};

export const Header = ({ className }: HeaderProps): JSX.Element => (
  <header className="pt-5 pb-2 text-text-white bg-dark links-nocolor">
    <div className={className}>
      <div className="flex flex-row mx-4">
        <Link to="/">
          <h1 className="text-[2rem] font-bold">Shakala</h1>
          <div>des échanges critiques et bienveillants</div>
        </Link>

        <div className="flex flex-col flex-1 items-end">
          <div className="flex-1">
            <SearchParamLink param="auth" value="login" className="flex flex-row gap-2 items-center">
              <span className="font-bold">Connexion</span>
              <Avatar big className="border-none" />
            </SearchParamLink>
          </div>

          <nav className="hidden flex-row gap-4 font-semibold text-text-white/90 uppercase md:flex">
            <HeaderNavLink to="/">Accueil</HeaderNavLink>
            <HeaderNavLink to="/discussions">Discussions</HeaderNavLink>
            <HeaderNavLink to="/charte">La charte</HeaderNavLink>
            <HeaderNavLink to="/faq">FAQ</HeaderNavLink>
          </nav>
        </div>
      </div>
    </div>
  </header>
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
