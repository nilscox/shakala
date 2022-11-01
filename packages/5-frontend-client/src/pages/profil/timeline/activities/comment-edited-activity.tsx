import { CommentActivityType } from 'shared';

import IconEdit from '~/icons/edit.svg';

import { Activity, ActivityItem, CommentLink, ThreadLink } from '../user-activity';

export const CommentEditedActivity: ActivityItem<CommentActivityType.commentEdited> = ({ activity }) => (
  <Activity activity={activity} icon={<IconEdit />}>
    <p>
      Vous avez édité <CommentLink {...activity.payload}>votre commentaire</CommentLink> sur le fil de
      discussion <ThreadLink {...activity.payload} />.
    </p>
  </Activity>
);
