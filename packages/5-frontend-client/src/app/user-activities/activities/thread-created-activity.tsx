import { ThreadActivityType } from '@shakala/shared';

import IconThread from '~/icons/thread.svg';

import { Activity, ActivityItem, ThreadLink } from '../user-activity';

export const ThreadCreatedActivity: ActivityItem<ThreadActivityType.threadCreated> = ({ activity }) => (
  <Activity activity={activity} icon={<IconThread />}>
    <p>
      Vous avez créé un nouveau fil de discussion :{' '}
      <ThreadLink threadId={activity.payload.threadId} threadDescription={activity.payload.description} />.
    </p>
  </Activity>
);
