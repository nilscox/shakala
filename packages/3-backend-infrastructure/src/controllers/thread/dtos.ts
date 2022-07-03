import { Comment, CommentAuthor, Thread, ThreadAuthor } from 'backend-domain';
import { CommentDto, ThreadDto, ThreadWithCommentsDto } from 'shared';

export const authorToDto = (author: ThreadAuthor | CommentAuthor) => ({
  id: author.id,
  nick: author.nick.value,
  profileImage: author.profileImage.value ?? undefined,
});

export const commentToDto = (comment: Comment): CommentDto => ({
  id: comment.id,
  author: authorToDto(comment.author),
  text: comment.text.value,
  date: comment.creationDate.value,
  edited: !comment.lastEditionDate.equals(comment.creationDate) ? comment.lastEditionDate.value : false,
  upvotes: comment.upvotes,
  downvotes: comment.downvotes,
});

export const threadToSummaryDto = (thread: Thread): ThreadDto => ({
  id: thread.id,
  date: thread.created.value,
  author: authorToDto(thread.author),
  text: thread.text.value,
});

export const threadToDto = (
  thread: Thread,
  comments: Comment[],
  replies: Map<string, Comment[]>,
): ThreadWithCommentsDto => ({
  ...threadToSummaryDto(thread),
  comments: comments.map((comment) => ({
    ...commentToDto(comment),
    replies: (replies.get(comment.id) ?? []).map((reply) => commentToDto(reply)),
  })),
});
