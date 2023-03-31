import { NotImplemented } from '~/app/not-implemented';

import { ProfileTitle } from '../profile-title';

export { ProfileLayout as Layout } from '../profile-layout';
export { ReputationPage as Page };

const ReputationPage = () => (
  <>
    <ProfileTitle title="Réputation" subTitle="Votre réputation" pageTitle="réputation" />
    <NotImplemented />
  </>
);
