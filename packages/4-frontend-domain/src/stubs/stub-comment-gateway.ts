import { CommentGateway } from '../gateways/comment-gateway';
import { createStubFunction } from '../utils/create-stub-function';

export class StubCommentGateway implements CommentGateway {
  createReply = createStubFunction<CommentGateway['createReply']>();
  editComment = createStubFunction<CommentGateway['editComment']>();
  setReaction = createStubFunction<CommentGateway['setReaction']>();
  reportComment = createStubFunction<CommentGateway['reportComment']>();
}
