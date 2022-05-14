import { Comment as CommentType } from '~/types';

import { Comment } from './comment';

export type CommentsListProps = {
  comments: CommentType[];
};

export const CommentsList = ({ comments }: CommentsListProps): JSX.Element => (
  <div className="flex flex-col gap-4">
    {comments.map((comment) => (
      <Comment key={comment.id} comment={comment} />
    ))}
  </div>
);
