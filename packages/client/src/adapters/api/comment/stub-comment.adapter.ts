import { stub } from '@shakala/shared';

import { CommentPort } from './comment.port';

export class StubCommentAdapter implements CommentPort {
  createComment = stub<CommentPort['createComment']>();
  createReply = stub<CommentPort['createReply']>();
  editComment = stub<CommentPort['editComment']>();
  setReaction = stub<CommentPort['setReaction']>();
  setSubscription = stub<CommentPort['setSubscription']>();
  reportComment = stub<CommentPort['reportComment']>();
}
