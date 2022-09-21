import { changeProfileImage, logout } from 'frontend-domain';
import { FormEventHandler } from 'react';

import { PageTitle } from '~/components/layout/page-title';
import { useDispatch } from '~/hooks/use-dispatch';
import { useUser } from '~/hooks/use-user';

export const Profile = () => {
  const user = useUser();
  const dispatch = useDispatch();

  const handleChangeProfileImage: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const image = form.get('profileImage') as File;

    dispatch(changeProfileImage(image));
  };

  return (
    <>
      <PageTitle>{`${user?.nick} : page profil`}</PageTitle>

      <h1>{user?.nick}</h1>

      <form onSubmit={handleChangeProfileImage}>
        <input type="file" name="profileImage" />
        <button type="submit">Changer</button>
      </form>

      <button onClick={() => dispatch(logout())}>Déconnexion</button>
    </>
  );
};
