import { TOKENS } from '~/app/tokens';
import { Avatar } from '~/elements/avatar/avatar';
import { Chip } from '~/elements/chip';
import { useSnackbar } from '~/elements/snackbar';
import { VerticalTab, VerticalTabs } from '~/elements/vertical-tabs';
import { useMutate } from '~/hooks/use-mutate';
import { useInvalidateQuery, useQuery } from '~/hooks/use-query';
import { useNavigate } from '~/hooks/use-router';
import { useUser } from '~/hooks/use-user';
import IconArrowDown from '~/icons/arrow-down.svg';
import IconEdit from '~/icons/edit.svg';
import IconProfile from '~/icons/profile.svg';
import IconSignOut from '~/icons/sign-out.svg';
import IconSubscribe from '~/icons/subscribe.svg';
import IconTrophy from '~/icons/trophy.svg';
import IconVerified from '~/icons/verified.svg';
import { withSuspense } from '~/utils/with-suspense';

type ProfileLayoutProps = {
  children: React.ReactNode;
};

export const ProfileLayout = ({ children }: ProfileLayoutProps) => (
  <div className="col md:row md:my-4 md:gap-6">
    <Sidebar />
    <div className="flex-1">{children}</div>
  </div>
);

const Sidebar = () => {
  const user = useUser();

  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const invalidate = useInvalidateQuery();

  const signOut = useMutate(TOKENS.authentication, 'signOut', {
    async onSuccess() {
      await navigate('/');
      await invalidate([]);
      snackbar.info("Vous n'êtes maintenant plus connecté·e");
    },
  });

  return (
    <aside className="max-w-2 md:max-w-1">
      <div className="row gap-4 self-center p-4 md:p-6">
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

      <VerticalTabs>
        <VerticalTab to="/profil" Icon={IconProfile}>
          Profil
        </VerticalTab>

        <VerticalTab to="/profil/notifications" Icon={IconSubscribe} right={<UnseenNotificationsChip />}>
          Notifications
        </VerticalTab>

        <VerticalTab to="/profil/badges" Icon={IconTrophy}>
          Badges
        </VerticalTab>

        <VerticalTab to="/profil/reputation" Icon={IconVerified}>
          Réputation
        </VerticalTab>

        <VerticalTab to="/profil/brouillons" Icon={IconEdit}>
          Brouillons
        </VerticalTab>

        <VerticalTab to="/profil/timeline" Icon={IconArrowDown}>
          Timeline
        </VerticalTab>

        <VerticalTab Icon={IconSignOut} onClick={signOut}>
          Déconnexion
        </VerticalTab>
      </VerticalTabs>
    </aside>
  );
};

const UnseenNotificationsChip = withSuspense(
  () => {
    const totalUnseenNotifications = useQuery(TOKENS.account, 'getNotificationsCount');

    if (totalUnseenNotifications === 0) {
      return null;
    }

    return <Chip className="ml-auto">{totalUnseenNotifications}</Chip>;
  },
  () => null
);
