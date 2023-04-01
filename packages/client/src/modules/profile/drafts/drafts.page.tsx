import { NotImplemented } from '~/app/not-implemented';

import { ProfileTitle } from '../profile-title';

export { ProfileLayout as Layout } from '../profile-layout';
export { DraftsPage as Page };
export const authenticationRequired = true;

const DraftsPage = () => (
  <>
    <ProfileTitle
      title="Brouillons"
      subTitle="Les messages que vous avez commencé à rédiger mais n'avez pas encore publié"
      pageTitle="brouillons"
    />

    <NotImplemented />
  </>
);
