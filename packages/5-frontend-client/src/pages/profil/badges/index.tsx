import { ProfileTitle } from '~/app/profile/profile-title';
import { ssr } from '~/utils/ssr';

export const getServerSideProps = ssr.authenticated();

const BadgesPage = () => (
  <>
    <ProfileTitle title="Badges" subTitle="Vos badges" pageTitle="badges" />
    <div className="text-xxl">Coming soon...</div>
  </>
);

export default BadgesPage;
