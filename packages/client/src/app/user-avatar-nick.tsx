import { AvatarNick } from '~/elements/avatar/avatar-nick';
import { useUser } from '~/hooks/use-user';

export const UserAvatarNick = () => {
  const user = useUser();

  return <AvatarNick nick={user?.nick ?? 'Moi'} image={user?.profileImage} />;
};
