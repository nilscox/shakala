import clsx from 'clsx';
import { logout } from 'frontend-domain';
import { Navigate, Outlet, useMatch } from 'react-router-dom';

import { AsyncResource } from '~/components/elements/async-resource/async-resource';
import { Avatar } from '~/components/elements/avatar/avatar';
import { NavLink } from '~/components/elements/link';
import { useDispatch } from '~/hooks/use-dispatch';
import { useIsFetchingUser, useUser } from '~/hooks/use-user';
import IconArrowDown from '~/icons/arrow-down.svg';
import IconEdit from '~/icons/edit.svg';
import IconProfile from '~/icons/profile.svg';
import IconSignOut from '~/icons/sign-out.svg';
import IconSubscribe from '~/icons/subscribe.svg';
import IconTrophy from '~/icons/trophy.svg';
import IconVerified from '~/icons/verified.svg';

class UnauthenticatedError extends Error {}

export const ProfileLayout = () => {
  const user = useUser();
  const fetchingUser = useIsFetchingUser();

  return (
    <AsyncResource
      loading={fetchingUser}
      data={user}
      error={!fetchingUser && !user && new UnauthenticatedError()}
      render={() => (
        <div className="row my-4 gap-6">
          <Sidebar />
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      )}
      renderError={(error) => {
        if (error instanceof UnauthenticatedError) {
          return (
            <Navigate to={{ pathname: '/', search: new URLSearchParams({ auth: 'login' }).toString() }} />
          );
        }

        throw error;
      }}
    />
  );
};

const Sidebar = () => {
  const user = useUser();
  const dispatch = useDispatch();

  return (
    <aside>
      <div className="row gap-4 self-center p-6">
        <Avatar size="big" image={user?.profileImage} />
        <div>
          <div className="text-lg font-semibold">{user?.nick}</div>
          <div className="text-xs leading-[1]">Votre compte utilisateur</div>
        </div>
      </div>

      <ul className="links-nocolor font-medium">
        <SidebarItem to="/profil" Icon={IconProfile}>
          Profil
        </SidebarItem>
        <SidebarItem to="/profil/notifications" Icon={IconSubscribe}>
          Notifications
          <Chip className="ml-auto">3</Chip>
        </SidebarItem>
        <SidebarItem to="/profil/badges" Icon={IconTrophy}>
          Badges
        </SidebarItem>
        <SidebarItem to="/profil/reputation" Icon={IconVerified}>
          Réputation
        </SidebarItem>
        <SidebarItem to="/profil/brouillons" Icon={IconEdit}>
          Brouillons
        </SidebarItem>
        <SidebarItem to="/profil/timeline" Icon={IconArrowDown}>
          Timeline
        </SidebarItem>
        <SidebarItem to="#" Icon={IconSignOut} onClick={() => dispatch(logout())}>
          Déconnexion
        </SidebarItem>
      </ul>
    </aside>
  );
};

type ChipProps = {
  className?: string;
  children: React.ReactNode;
};

const Chip = ({ className, children }: ChipProps) => (
  <span
    // eslint-disable-next-line tailwindcss/no-arbitrary-value
    className={clsx(
      'col h-[1.25rem] w-[1.25rem] items-center justify-center rounded-full bg-primary text-sm text-white',
      className,
    )}
  >
    {children}
  </span>
);

type SidebarItemProps = {
  to: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  children: React.ReactNode;
};

const SidebarItem = ({ to, Icon, onClick, children }: SidebarItemProps) => {
  const isActive = useMatch(to);

  return (
    <li>
      <NavLink
        to={to}
        onClick={onClick}
        className={clsx(
          'row my-0.5 block items-center gap-1 rounded border-l-4 border-transparent py-0.5 px-2 transition-colors hover:bg-inverted/5',
          isActive && '!border-warning bg-inverted/5 font-semibold',
        )}
      >
        {Icon && <Icon className="h-4 w-4 text-muted" />}
        {children}
      </NavLink>
    </li>
  );
};
