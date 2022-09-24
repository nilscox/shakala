import { Entity, EntityProps } from '../ddd/entity';

import { DomainError } from './domain-error';
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

export const CannotReportOwnCommentError = DomainError.extend(
  'user cannot report his own comment',
  (commentId: string) => ({ commentId }),
);

export const CommentAlreadyReportedError = DomainError.extend(
  'comment already reported by user',
  (commentId: string) => ({ commentId }),
);
