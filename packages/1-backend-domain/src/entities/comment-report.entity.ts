import { Entity, EntityProps } from '../ddd/entity';

import { User } from './user.entity';

export type CommentReportProps = EntityProps<{
  commentId: string;
  reportedBy: User;
  reason: string | null;
}>;

export class CommentReport extends Entity<CommentReportProps> {
  get commentId() {
    return this.props.commentId;
  }

  get reportedBy() {
    return this.props.reportedBy;
  }

  get reason() {
    return this.props.reason;
  }
}
