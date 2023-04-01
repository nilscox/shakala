import { last, UserActivityDto } from '@shakala/shared';

import { InfiniteScroll } from '~/elements/infinite-scroll/infinite-scroll';

import { activityComponentMap } from './activities';
import { ActivityItem } from './user-activity';

type UserActivitiesProps = {
  activities: UserActivityDto[];
  hasMore: boolean;
  loadMore: () => void;
  loading: boolean;
};

export const UserActivities = ({ activities, hasMore, loadMore, loading }: UserActivitiesProps) => {
  const renderActivity = (activity: UserActivityDto, index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = activityComponentMap[activity.type] as ActivityItem<any>;
    return <Component key={index} isFirst={activity === last(activities)} activity={activity} />;
  };

  return (
    <>
      <div className="text-xs font-semibold uppercase text-muted">Maintenant</div>

      <div className="ml-2">
        <InfiniteScroll
          items={activities}
          hasMore={hasMore}
          loading={loading}
          loadMore={loadMore}
          loaderClassName="ml-2"
        >
          {renderActivity}
        </InfiniteScroll>
      </div>
    </>
  );
};
