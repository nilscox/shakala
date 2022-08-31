import { logout } from 'frontend-domain';

import { PageTitle } from '~/components/layout/page-title';
import { useDispatch } from '~/hooks/use-dispatch';
import { useUser } from '~/hooks/use-user';

export const Profile = () => {
  const user = useUser();
  const dispatch = useDispatch();

  return (
    <>
      <PageTitle>{`${user?.nick} : page profil`}</PageTitle>
      <h1>{user?.nick}</h1>
      <button onClick={() => dispatch(logout())}>Déconnexion</button>
    </>
  );
};
