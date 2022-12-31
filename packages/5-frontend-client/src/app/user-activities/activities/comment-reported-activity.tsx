import { CommentActivityType } from '@shakala/shared';

import IconReport from '~/icons/report.svg';

import { Activity, ActivityItem, CommentLink, ThreadLink } from '../user-activity';

export const CommentReportedActivity: ActivityItem<CommentActivityType.commentReported> = ({ activity }) => (
  <Activity activity={activity} icon={<IconReport />}>
    <p>
      Vous avez signalé <CommentLink {...activity.payload}>un commentaire</CommentLink> sur le fil de
      discussion <ThreadLink {...activity.payload} />.
    </p>
  </Activity>
);
