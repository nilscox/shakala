import { EntityProps, Entity } from '@shakala/common';

export type CommentReportProps = EntityProps<{
  commentId: string;
  reportedById: string;
  reason?: string;
}>;

export class CommentReport extends Entity<CommentReportProps> {
  get commentId() {
    return this.props.commentId;
  }

  get reportedById() {
    return this.props.reportedById;
  }

  get reason() {
    return this.props.reason;
  }
}
