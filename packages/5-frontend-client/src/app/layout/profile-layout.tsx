import { clsx } from 'clsx';
import { logout } from 'frontend-domain';
import React from 'react';

import { Avatar } from '~/elements/avatar/avatar';
import { Chip } from '~/elements/chip';
import { NavLink } from '~/elements/link';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useUser } from '~/hooks/use-user';
import IconArrowDown from '~/icons/arrow-down.svg';
import IconEdit from '~/icons/edit.svg';
import IconProfile from '~/icons/profile.svg';
import IconSignOut from '~/icons/sign-out.svg';
import IconSubscribe from '~/icons/subscribe.svg';
import IconTrophy from '~/icons/trophy.svg';
import IconVerified from '~/icons/verified.svg';

type ProfileLayoutProps = {
  children: React.ReactNode;
};

export const ProfileLayout = ({ children }: ProfileLayoutProps) => (
  <div className="row my-4 gap-6">
    <Sidebar />
    <div className="flex-1">{children}</div>
  </div>
);

const Sidebar = () => {
  const user = useUser();
  const dispatch = useAppDispatch();

  // todo
  // const unseenNotificationsCount = useSelector(selectUnseenNotificationsCount);
  const unseenNotificationsCount = 0;

  return (
    <aside>
      <div className="row gap-4 self-center p-6">
        <Avatar size="big" image={user?.profileImage} />
        <div>
          <div className="text-lg font-semibold">{user?.nick}</div>
          <div
            // eslint-disable-next-line tailwindcss/no-arbitrary-value
            className="text-xs leading-[1]"
          >
            Votre compte utilisateur
          </div>
        </div>
      </div>

      <ul className="links-nocolor font-medium">
        <SidebarItem to="/profil" Icon={IconProfile}>
          Profil
        </SidebarItem>
        <SidebarItem to="/profil/notifications" Icon={IconSubscribe}>
          Notifications
          {unseenNotificationsCount > 0 && <Chip className="ml-auto">{unseenNotificationsCount}</Chip>}
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
        <SidebarItem Icon={IconSignOut} onClick={() => dispatch(logout())}>
          Déconnexion
        </SidebarItem>
      </ul>
    </aside>
  );
};

type SidebarItemProps = {
  to?: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  children: React.ReactNode;
};

const SidebarItem = ({ to, Icon, onClick, children }: SidebarItemProps) => {
  const kids = (
    <>
      {Icon && <Icon className="h-4 w-4 text-muted" />}
      {children}
    </>
  );

  const className = clsx(
    'row my-0.5 w-full items-center gap-1 rounded border-l-4 border-transparent py-0.5 px-2 transition-colors hover:bg-inverted/5',
  );

  if (!to) {
    return (
      <li>
        <button className={className} onClick={onClick}>
          {kids}
        </button>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        href={to}
        className={className}
        activeClassName="!border-warning bg-inverted/5 font-semibold"
        onClick={onClick}
      >
        {kids}
      </NavLink>
    </li>
  );
};
