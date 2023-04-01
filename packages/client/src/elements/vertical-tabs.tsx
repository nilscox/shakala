import clsx from 'clsx';

import { NavLink } from './link';

type VerticalTabsProps = {
  children: React.ReactNode;
};

export const VerticalTabs = ({ children }: VerticalTabsProps) => (
  <div role="tablist" className="links-nocolor font-medium">
    {children}
  </div>
);

type VerticalTabProps = {
  to?: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  right?: React.ReactNode;
  children: React.ReactNode;
};

export const VerticalTab = ({ to, Icon, onClick, right, children }: VerticalTabProps) => {
  const kids = (
    <>
      {Icon && <Icon className="h-4 w-4 text-muted" />}
      {children}
      {right}
    </>
  );

  const className = clsx(
    'row my-0.5 items-center gap-1 py-0.5 px-2',
    'transition-colors hover:bg-inverted/5',
    'rounded border-l-4 border-transparent'
  );

  if (!to) {
    return (
      <button role="tab" className={className} onClick={onClick}>
        {kids}
      </button>
    );
  }

  return (
    <NavLink
      role="tab"
      exact
      href={to}
      className={className}
      activeClassName="!border-warning bg-inverted/5 font-semibold"
      onClick={onClick}
    >
      {kids}
    </NavLink>
  );
};
