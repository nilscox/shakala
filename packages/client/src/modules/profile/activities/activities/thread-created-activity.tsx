import { UserActivityType } from '@shakala/shared';

import IconThread from '~/icons/thread.svg';

import { Activity, ActivityItem, ThreadLink } from '../user-activity';

export const ThreadCreatedActivity: ActivityItem<UserActivityType.threadCreated> = (props) => (
  <Activity icon={<IconThread />} {...props}>
    <p>
      Vous avez créé un nouveau fil de discussion :{' '}
      <ThreadLink
        threadId={props.activity.payload.threadId}
        threadDescription={props.activity.payload.description}
      />
      .
    </p>
  </Activity>
);
