import { ProfileTitle } from '~/app/profile/profile-title';
import { ssr } from '~/utils/ssr';

export const getServerSideProps = ssr.authenticated();

const BadgesPage = () => (
  <>
    <ProfileTitle
      title="Badges"
      subTitle="Les badges que vous avez obtenu via diverses actions sur Shakala"
      pageTitle="badges"
    />
    <div className="text-xxl">Coming soon...</div>
  </>
);

export default BadgesPage;
