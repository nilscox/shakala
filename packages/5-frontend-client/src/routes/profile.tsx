import { logout } from 'frontend-domain';

import { AppTitle } from '~/components/layout/app-title';
import { useDispatch } from '~/hooks/use-dispatch';
import { useUser } from '~/hooks/use-user';

import { PageTitle } from './components/page-title';

export const Profile = () => {
  const user = useUser();
  const dispatch = useDispatch();

  return (
    <>
      <AppTitle>{`${user?.nick} : page profile`}</AppTitle>
      <PageTitle>{user?.nick}</PageTitle>
      <button onClick={() => dispatch(logout())}>Déconnexion</button>
    </>
  );
};
