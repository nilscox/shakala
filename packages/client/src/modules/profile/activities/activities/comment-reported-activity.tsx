import { UserActivityType } from '@shakala/shared';

import IconReport from '~/icons/report.svg';

import { Activity, ActivityItem, CommentLink, ThreadLink } from '../user-activity';

export const CommentReportedActivity: ActivityItem<UserActivityType.commentReported> = (props) => (
  <Activity icon={<IconReport />} {...props}>
    <p>
      Vous avez signalé <CommentLink {...props.activity.payload}>un commentaire</CommentLink> sur le fil de
      discussion <ThreadLink {...props.activity.payload} />.
    </p>
  </Activity>
);
