import { GetThreadQueryResult } from 'backend-application';
import { Comment, CommentAuthor, Thread, ThreadAuthor } from 'backend-domain';
import { CommentDto, ThreadDto, ThreadWithCommentsDto, UserDto } from 'shared';

export class ThreadPresenter {
  static transformThreadSummary(thread: Thread): ThreadDto {
    return {
      id: thread.id,
      date: thread.created.value,
      author: this.transformAuthor(thread.author),
      text: thread.text.value,
    };
  }

  static transformThread(result: GetThreadQueryResult): ThreadWithCommentsDto {
    const { thread, comments } = result;

    return {
      ...this.transformThreadSummary(thread),
      comments: comments.map((comment) => this.transformComment(comment, result.replies.get(comment.id))),
    };
  }

  private static transformAuthor(author: ThreadAuthor | CommentAuthor): UserDto {
    return {
      id: author.id,
      nick: author.nick.value,
      profileImage: author.profileImage.value ?? undefined,
    };
  }

  static transformComment(comment: Comment, replies?: Comment[]): CommentDto {
    return {
      id: comment.id,
      author: this.transformAuthor(comment.author),
      text: comment.text.value,
      date: comment.creationDate.value,
      edited: !comment.lastEditionDate.equals(comment.creationDate) ? comment.lastEditionDate.value : false,
      upvotes: comment.upvotes,
      downvotes: comment.downvotes,
      replies: replies?.map((reply) => this.transformComment(reply)),
    };
  }
}
