import { GetThreadQueryResult } from 'backend-application';
import { ReactionsCount } from 'backend-application/src/interfaces/reaction.repository';
import { Comment, CommentAuthor, ReactionType, Thread, ThreadAuthor } from 'backend-domain';
import { CommentDto, ReactionTypeDto, ThreadDto, ThreadWithCommentsDto, UserDto } from 'shared';

export class ThreadPresenter {
  static transformThreadSummary(thread: Thread): ThreadDto {
    return {
      id: thread.id,
      date: thread.created.toString(),
      author: ThreadPresenter.transformAuthor(thread.author),
      text: thread.text.toString(),
    };
  }

  static transformThread(result: GetThreadQueryResult): ThreadWithCommentsDto {
    const { thread, comments } = result;

    return {
      ...ThreadPresenter.transformThreadSummary(thread),
      comments: comments.map((comment) =>
        ThreadPresenter.transformComment(
          comment,
          result.replies.get(comment.id),
          result.reactionsCounts,
          result.userReactions,
        ),
      ),
    };
  }

  private static transformAuthor(author: ThreadAuthor | CommentAuthor): UserDto {
    return {
      id: author.id,
      nick: author.nick.toString(),
      profileImage: author.profileImage.toString() ?? undefined,
    };
  }

  static transformComment(
    comment: Comment,
    replies: Comment[] | undefined,
    reactionsCounts: Map<string, ReactionsCount>,
    userReactions: Map<string, ReactionType | undefined> | undefined,
  ): CommentDto {
    const reactionCounts = reactionsCounts.get(comment.id) as ReactionsCount;

    const dto: CommentDto = {
      id: comment.id,
      author: ThreadPresenter.transformAuthor(comment.author),
      text: comment.text.toString(),
      date: comment.creationDate.toString(),
      edited: !comment.lastEditionDate.equals(comment.creationDate)
        ? comment.lastEditionDate.toString()
        : false,
      upvotes: reactionCounts[ReactionType.upvote],
      downvotes: reactionCounts[ReactionType.downvote],
    };

    if (userReactions) {
      dto.userReaction = ThreadPresenter.transformReactionType(userReactions.get(comment.id));
    }

    if (replies) {
      dto.replies = replies.map((reply) =>
        ThreadPresenter.transformComment(reply, undefined, reactionsCounts, userReactions),
      );
    }

    return dto;
  }

  static transformReactionType(type?: ReactionType): ReactionTypeDto | undefined {
    if (!type) {
      return;
    }

    return {
      [ReactionType.upvote]: ReactionTypeDto.upvote,
      [ReactionType.downvote]: ReactionTypeDto.downvote,
    }[type];
  }
}
