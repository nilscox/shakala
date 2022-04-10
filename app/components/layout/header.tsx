import { NavLink, NavLinkProps } from '@remix-run/react';

type HeaderProps = {
  className?: string;
};

export const Header = ({ className }: HeaderProps): JSX.Element => (
  <header className="pt-5 pb-2 text-text-white bg-dark">
    <div className={className}>
      <div className="flex flex-row justify-between items-end mx-4">
        <div>
          <h1 className="text-[2rem] font-bold">Shakala</h1>
          <div>des échanges critiques et bienveillants</div>
        </div>

        <nav className="flex flex-row gap-4 font-semibold text-text-white/90 uppercase">
          <HeaderNavLink to="/">Accueil</HeaderNavLink>
          <HeaderNavLink to="/utilisation">Utilisation</HeaderNavLink>
          <HeaderNavLink to="/charte">La charte</HeaderNavLink>
          <HeaderNavLink to="/faq">FAQ</HeaderNavLink>
        </nav>
      </div>
    </div>
  </header>
);

const HeaderNavLink = (props: NavLinkProps) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <NavLink
    prefetch="intent"
    className="hover:text-text-white border-b-2 border-transparent hover:border-b-primary"
    {...props}
  />
);
