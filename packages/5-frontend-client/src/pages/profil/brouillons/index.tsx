import { ProfileTitle } from '~/app/profile/profile-title';
import { ssr } from '~/utils/ssr';

export const getServerSideProps = ssr.authenticated();

const DraftsPage = () => (
  <>
    <ProfileTitle
      title="Brouillons"
      subTitle="Les messages que vous avez rédigé mais n'avez pas encore publié"
      pageTitle="brouillons"
    />
    <div className="text-xxl">Coming soon...</div>
  </>
);

export default DraftsPage;
