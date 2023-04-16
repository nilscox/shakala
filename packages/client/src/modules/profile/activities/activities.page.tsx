import { TOKENS } from '~/app/tokens';
import { usePaginatedQuery } from '~/hooks/use-query';
import { prefetchQuery } from '~/utils/prefetch-query';
import { withSuspense } from '~/utils/with-suspense';

import { ProfileTitle } from '../profile-title';

import { UserActivities } from './user-activities';

export { ProfileLayout as Layout } from '../profile-layout';
export { TimelinePage as Page };
export const authenticationRequired = true;

export const queries = [prefetchQuery(TOKENS.account, 'getUserActivities', 1)];

const TimelinePage = () => (
  <>
    <ProfileTitle
      title="Timeline"
      subTitle="L'activité de votre compte au cours du temps"
      pageTitle="timeline"
    />

    <Activities />
  </>
);

const Activities = withSuspense(() => {
  const [activities, { hasMore, loadMore }] = usePaginatedQuery(
    TOKENS.account,
    'getUserActivities',
    (page) => [page] as [number]
  );

  return <UserActivities activities={activities} hasMore={hasMore} loadMore={loadMore} loading={false} />;
}, 'Activities');
