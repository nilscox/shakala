import {
  createUser,
  createThread,
  createComment,
  GetThreadQueryResult,
  createReactionsCount,
  createMessage,
} from 'backend-application';
import { Author, ReactionType } from 'backend-domain';
import { CommentDto, ThreadWithCommentsDto } from 'shared';

import { ThreadPresenter } from './thread.presenter';

describe('ThreadPresenter', () => {
  const threadAuthor = createUser();
  const thread = createThread({ author: threadAuthor });

  const commentAuthor = new Author(createUser());
  const comment = createComment({
    author: commentAuthor,
    history: [createMessage()],
  });

  const replyAuthor = createUser();
  const reply = createComment({ author: replyAuthor });

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
    text: reply.message.toString(),
    history: [],
    date: reply.creationDate.toString(),
    edited: false,
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
    text: comment.message.toString(),
    history: comment.history.map((message) => ({
      text: message.toString(),
      date: message.date.toString(),
    })),
    date: comment.creationDate.toString(),
    edited: comment.message.date.toString(),
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
