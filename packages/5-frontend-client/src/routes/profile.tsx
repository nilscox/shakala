import { logout } from 'frontend-domain';

import { useDispatch } from '~/hooks/use-dispatch';
import { useUser } from '~/hooks/use-user';

export const Profile = () => {
  const user = useUser();
  const dispatch = useDispatch();

  return (
    <>
      <h2 className="my-5 text-xl font-bold">{user?.nick}</h2>
      <button onClick={() => dispatch(logout())}>Déconnexion</button>
    </>
  );
};
