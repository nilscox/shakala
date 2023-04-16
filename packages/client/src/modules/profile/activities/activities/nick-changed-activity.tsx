import { UserActivityType } from '@shakala/shared';

import IconArrowRight from '~/icons/arrow-right-alt.svg';
import IconEdit from '~/icons/edit.svg';

import { Activity, ActivityItem } from '../user-activity';

export const NickChangedActivity: ActivityItem<UserActivityType.nickChanged> = (props) => (
  <Activity icon={<IconEdit />} {...props}>
    <p>
      Vous avez changé votre pseudo : {props.activity.payload.oldValue}{' '}
      <IconArrowRight className="inline fill-muted" /> <strong>{props.activity.payload.newValue}</strong>.
    </p>
  </Activity>
);
