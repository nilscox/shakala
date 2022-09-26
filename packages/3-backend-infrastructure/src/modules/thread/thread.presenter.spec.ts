import { GetThreadQueryResult } from 'backend-application';
import { factories, ReactionType } from 'backend-domain';
import { CommentDto, ThreadWithCommentsDto } from 'shared';

import { StubConfigAdapter } from '../../infrastructure';
import { UserPresenter } from '../user/user.presenter';

import { ThreadPresenter } from './thread.presenter';

describe('ThreadPresenter', () => {
  const create = factories();

  const threadAuthor = create.user();
  const thread = create.thread({
    author: threadAuthor,
    description: 'description',
    keywords: ['keyword1', 'keyword2'],
  });

  const commentAuthor = create.author(create.user());
  const comment = create.comment({
    author: commentAuthor,
    history: [create.message()],
  });

  const replyAuthor = create.user();
  const reply = create.comment({ author: replyAuthor });

  const getThreadQueryResult: GetThreadQueryResult = {
    thread,
    comments: [comment],
    replies: new Map([[comment.id, [reply]]]),
    reactionsCounts: new Map([
      [comment.id, create.reactionsCount({ [ReactionType.downvote]: 1 })],
      [reply.id, create.reactionsCount({ [ReactionType.upvote]: 1 })],
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
    description: thread.description,
    keywords: thread.keywords,
    text: thread.text.toString(),
    comments: [commentDto],
    date: thread.created.toString(),
  };

  const presenter = new ThreadPresenter(new UserPresenter(new StubConfigAdapter()));

  it('transforms a thread', () => {
    expect(presenter.transformThread(getThreadQueryResult)).toEqual(threadDto);
  });

  it("transforms the user's reactions", () => {
    const userReactions = new Map([
      [comment.id, ReactionType.downvote],
      [reply.id, undefined],
    ]);

    expect(
      presenter.transformComment(comment, [reply], getThreadQueryResult.reactionsCounts, userReactions),
    ).toEqual({
      ...commentDto,
      userReaction: ReactionType.downvote,
    });
  });
});
