import { logout } from 'frontend-domain';

import { useDispatch } from '~/hooks/use-dispatch';
import { useUser } from '~/hooks/use-user';

import { PageTitle } from './components/page-title';

export const Profile = () => {
  const user = useUser();
  const dispatch = useDispatch();

  return (
    <>
      <PageTitle>{user?.nick}</PageTitle>
      <button onClick={() => dispatch(logout())}>Déconnexion</button>
    </>
  );
};
