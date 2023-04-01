import { UserActivityType } from '@shakala/shared';

import IconEdit from '~/icons/edit.svg';

import { Activity, ActivityItem, CommentLink, ThreadLink } from '../user-activity';

export const CommentEditedActivity: ActivityItem<UserActivityType.commentEdited> = (props) => (
  <Activity icon={<IconEdit />} {...props}>
    <p>
      Vous avez édité <CommentLink {...props.activity.payload}>votre commentaire</CommentLink> sur le fil de
      discussion <ThreadLink {...props.activity.payload} />.
    </p>
  </Activity>
);
