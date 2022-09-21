import { GetThreadQueryResult } from 'backend-application';
import { Author, Comment, ReactionsCount, ReactionType, Thread } from 'backend-domain';
import { CommentDto, ReactionTypeDto, ThreadDto, ThreadWithCommentsDto, UserDto } from 'shared';

import { UserPresenter } from '../user/user.presenter';

export class ThreadPresenter {
  constructor(private readonly userPresenter: UserPresenter) {}

  transformThreadSummary = (thread: Thread): ThreadDto => {
    return {
      id: thread.id,
      date: thread.created.toString(),
      author: this.transformAuthor(thread.author),
      description: thread.description,
      keywords: thread.keywords,
      text: thread.text.toString(),
    };
  };

  transformThread = (result: GetThreadQueryResult): ThreadWithCommentsDto => {
    const { thread, comments } = result;

    return {
      ...this.transformThreadSummary(thread),
      comments: comments.map((comment) =>
        this.transformComment(
          comment,
          result.replies.get(comment.id),
          result.reactionsCounts,
          result.userReactions,
        ),
      ),
    };
  };

  private transformAuthor = (author: Author): UserDto => {
    return this.userPresenter.transformUser(author);
  };

  transformComment = (
    comment: Comment,
    replies: Comment[] | undefined,
    reactionsCounts: Map<string, ReactionsCount>,
    userReactions: Map<string, ReactionType | undefined> | undefined,
  ): CommentDto => {
    const reactionCounts = reactionsCounts.get(comment.id) as ReactionsCount;

    const dto: CommentDto = {
      id: comment.id,
      author: this.transformAuthor(comment.author),
      date: comment.creationDate.toString(),
      text: comment.message.toString(),
      history: comment.history.map((message) => ({
        date: message.date.toString(),
        text: message.toString(),
      })),
      edited: comment.edited ? comment.edited.toString() : false,
      upvotes: reactionCounts[ReactionType.upvote],
      downvotes: reactionCounts[ReactionType.downvote],
    };

    if (userReactions) {
      dto.userReaction = this.transformReactionType(userReactions.get(comment.id));
    }

    if (replies) {
      dto.replies = replies.map((reply) =>
        this.transformComment(reply, undefined, reactionsCounts, userReactions),
      );
    }

    return dto;
  };

  transformReactionType = (type?: ReactionType): ReactionTypeDto | undefined => {
    if (!type) {
      return;
    }

    return {
      [ReactionType.upvote]: ReactionTypeDto.upvote,
      [ReactionType.downvote]: ReactionTypeDto.downvote,
    }[type];
  };
}
