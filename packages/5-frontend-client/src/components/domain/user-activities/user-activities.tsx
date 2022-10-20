import { fetchUserActivities, selectUserActivities, UserActivity } from 'frontend-domain';
import { useEffect } from 'react';
import { UserActivityType } from 'shared';

import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

import { activityComponentMap } from './activities';
import { ActivityItem } from './user-activity';

export const UserActivities = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserActivities(1));
  }, [dispatch]);

  const activities = useSelector(selectUserActivities);

  const renderActivity = <Type extends UserActivityType>(activity: UserActivity<Type>, index: number) => {
    const Component = activityComponentMap[activity.type] as ActivityItem<Type>;

    return <Component key={index} activity={activity} />;
  };

  return (
    <>
      <div className="text-xs font-semibold uppercase text-muted">Maintenant</div>
      <div className="ml-2">{activities.map(renderActivity)}</div>
    </>
  );
};
