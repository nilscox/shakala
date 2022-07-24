import {
  createUser,
  createThread,
  createComment,
  GetThreadQueryResult,
  createReactionsCount,
} from 'backend-application';
import { ReactionType } from 'backend-domain';
import { CommentDto, ThreadWithCommentsDto } from 'shared';

import { ThreadPresenter } from './thread.presenter';

describe('ThreadPresenter', () => {
  const threadAuthor = createUser();
  const thread = createThread({ author: threadAuthor });

  const commentAuthor = createUser();
  const comment = createComment({
    author: commentAuthor,
  });

  const replyAuthor = createUser();
  const reply = createComment({ author: replyAuthor, lastEditionDate: '2022-01-01' });

  const getThreadQueryResult: GetThreadQueryResult = {
    thread,
    comments: [comment],
    replies: new Map([[comment.id, [reply]]]),
    reactionsCounts: new Map([
      [comment.id, createReactionsCount({ [ReactionType.downvote]: 1 })],
      [reply.id, createReactionsCount({ [ReactionType.upvote]: 1 })],
    ]),
    userReactions: undefined,
  };

  const replyDto: CommentDto = {
    id: reply.id,
    author: {
      id: replyAuthor.id,
      nick: replyAuthor.nick.toString(),
      profileImage: undefined,
    },
    text: reply.text.toString(),
    date: reply.creationDate.toString(),
    edited: reply.lastEditionDate.toString(),
    upvotes: 1,
    downvotes: 0,
  };

  const commentDto: CommentDto = {
    id: comment.id,
    author: {
      id: commentAuthor.id,
      nick: commentAuthor.nick.toString(),
      profileImage: undefined,
    },
    text: comment.text.toString(),
    date: comment.creationDate.toString(),
    edited: false,
    upvotes: 0,
    downvotes: 1,
    replies: [replyDto],
  };

  const threadDto: ThreadWithCommentsDto = {
    id: thread.id,
    author: {
      id: threadAuthor.id,
      nick: threadAuthor.nick.toString(),
      profileImage: undefined,
    },
    text: thread.text.toString(),
    comments: [commentDto],
    date: thread.created.toString(),
  };

  it('transforms a thread', () => {
    expect(ThreadPresenter.transformThread(getThreadQueryResult)).toEqual(threadDto);
  });

  it("transforms the user's reactions", () => {
    const userReactions = new Map([
      [comment.id, ReactionType.downvote],
      [reply.id, undefined],
    ]);

    expect(
      ThreadPresenter.transformComment(comment, [reply], getThreadQueryResult.reactionsCounts, userReactions),
    ).toEqual({
      ...commentDto,
      userReaction: ReactionType.downvote,
    });
  });
});
