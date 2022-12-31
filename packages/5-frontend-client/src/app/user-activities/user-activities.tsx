import { UserActivity, userActivityActions, userActivitySelectors } from '@shakala/frontend-domain';
import { useEffect, useState } from 'react';
import { UserActivityType } from '@shakala/shared';

import { InfiniteScroll } from '~/elements/infinite-scroll/infinite-scroll';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';

import { activityComponentMap } from './activities';
import { ActivityItem } from './user-activity';

export const UserActivities = () => {
  const dispatch = useAppDispatch();

  const activities = useAppSelector(userActivitySelectors.all);
  const loadingActivities = useAppSelector(userActivitySelectors.isFetching);
  const hasMoreActivities = useAppSelector(userActivitySelectors.hasMore);

  const renderActivity = <Type extends UserActivityType>(activity: UserActivity<Type>, index: number) => {
    const Component = activityComponentMap[activity.type] as ActivityItem<Type>;

    return <Component key={index} activity={activity} />;
  };

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(userActivityActions.fetchActivities(page));
  }, [dispatch, page]);

  return (
    <>
      <div className="text-xs font-semibold uppercase text-muted">Maintenant</div>
      <div className="ml-2">
        <InfiniteScroll
          items={activities}
          hasMore={hasMoreActivities}
          loading={loadingActivities}
          loadMore={() => setPage(page + 1)}
          loaderClassName="ml-2"
        >
          {renderActivity}
        </InfiniteScroll>
      </div>
    </>
  );
};
