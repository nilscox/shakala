import { NotImplemented } from '~/app/not-implemented';

import { ProfileTitle } from '../profile-title';

export { ProfileLayout as Layout } from '../profile-layout';
export { BadgesPage as Page };
export const authenticationRequired = true;

const BadgesPage = () => (
  <>
    <ProfileTitle
      title="Badges"
      subTitle="Les badges que vous avez obtenu via diverses actions sur Shakala"
      pageTitle="badges"
    />

    <NotImplemented />
  </>
);
