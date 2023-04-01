import { useState } from 'react';

import { TOKENS } from '~/app/tokens';
import { useQuery } from '~/hooks/use-query';
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
  const [page, setPage] = useState(1);
  const { items: activities, total } = useQuery(TOKENS.account, 'getUserActivities', page);

  return (
    <UserActivities
      activities={activities}
      hasMore={activities.length < total}
      loadMore={() => setPage(page + 1)}
      loading={false}
    />
  );
}, 'Activities');
