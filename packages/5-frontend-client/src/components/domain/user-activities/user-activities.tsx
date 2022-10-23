import {
  fetchUserActivities,
  selectHasMoreActivities,
  selectIsLoadingActivities,
  selectUserActivities,
  UserActivity,
} from 'frontend-domain';
import { useEffect, useState } from 'react';
import { UserActivityType } from 'shared';

import { InfiniteScroll } from '~/components/elements/infinite-scroll/infinite-scroll';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

import { activityComponentMap } from './activities';
import { ActivityItem } from './user-activity';

export const UserActivities = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  const activities = useSelector(selectUserActivities);
  const loadingActivities = useSelector(selectIsLoadingActivities, page);
  const hasMoreActivities = useSelector(selectHasMoreActivities);

  useEffect(() => {
    dispatch(fetchUserActivities(page));
  }, [dispatch, page]);

  const renderActivity = <Type extends UserActivityType>(activity: UserActivity<Type>, index: number) => {
    const Component = activityComponentMap[activity.type] as ActivityItem<Type>;

    return <Component key={index} activity={activity} />;
  };

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
