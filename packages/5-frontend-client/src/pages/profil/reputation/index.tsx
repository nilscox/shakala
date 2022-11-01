import { ProfileTitle } from '~/app/profile/profile-title';
import { ssr } from '~/utils/ssr';

export const getServerSideProps = ssr.authenticated();

const ReputationPage = () => (
  <>
    <ProfileTitle title="Réputation" subTitle="Votre réputation" pageTitle="réputation" />
    <div className="text-xxl">Coming soon...</div>
  </>
);

export default ReputationPage;
