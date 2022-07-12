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
      nick: replyAuthor.nick.value,
      profileImage: undefined,
    },
    text: reply.text.value,
    date: reply.creationDate.value,
    edited: reply.lastEditionDate.value,
    upvotes: 1,
    downvotes: 0,
  };

  const commentDto: CommentDto = {
    id: comment.id,
    author: {
      id: commentAuthor.id,
      nick: commentAuthor.nick.value,
      profileImage: undefined,
    },
    text: comment.text.value,
    date: comment.creationDate.value,
    edited: false,
    upvotes: 0,
    downvotes: 1,
    replies: [replyDto],
  };

  const threadDto: ThreadWithCommentsDto = {
    id: thread.id,
    author: {
      id: threadAuthor.id,
      nick: threadAuthor.nick.value,
      profileImage: undefined,
    },
    text: thread.text.value,
    comments: [commentDto],
    date: thread.created.value,
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
