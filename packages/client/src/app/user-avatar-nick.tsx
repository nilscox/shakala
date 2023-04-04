import { AvatarNick } from '~/elements/avatar/avatar-nick';
import { useUser } from '~/hooks/use-user';
import { withSuspense } from '~/utils/with-suspense';

export const UserAvatarNick = withSuspense(
  () => {
    const user = useUser();

    return <AvatarNick nick={user?.nick ?? 'Moi'} image={user?.profileImage} />;
  },
  'UserAvatarNick',
  () => null
);
