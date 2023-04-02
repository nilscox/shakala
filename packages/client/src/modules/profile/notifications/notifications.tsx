import { NotificationDto } from '@shakala/shared';

import { InfiniteScroll } from '~/elements/infinite-scroll';

import { notificationComponentMap } from './notification-items';

type NotificationsProps = {
  notifications: NotificationDto[];
  hasMore: boolean;
  loadMore: () => void;
};

export const Notifications = ({ notifications, hasMore, loadMore }: NotificationsProps) => {
  const renderNotification = (notification: NotificationDto, index: number) => {
    const Component = notificationComponentMap[notification.type] as React.ComponentType<{
      notification: NotificationDto;
    }>;

    return <Component key={index} notification={notification} />;
  };

  return (
    <div className="col gap-4">
      <InfiniteScroll
        items={notifications}
        hasMore={hasMore}
        loading={false}
        loadMore={loadMore}
        loaderClassName="ml-2"
      >
        {renderNotification}
      </InfiniteScroll>
    </div>
  );
};
