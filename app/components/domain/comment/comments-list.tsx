import cx from 'classnames';

import { Comment as CommentType } from '~/types';

import { Comment } from './comment';

const border = false;

export type CommentsListProps = {
  comments: CommentType[];
  containerClassName?: string;
  commentClassName?: string;
  after?: React.ReactNode;
};

export const CommentsList = ({
  comments,
  containerClassName,
  commentClassName,
  after,
}: CommentsListProps): JSX.Element => (
  <>
    {comments.map((comment) => (
      <div
        key={comment.id}
        className={cx(
          'border-l-4 border-light-gray pl-[10px] mt-1 first-of-type:mt-0',
          border && 'border-b last-of-type:border-b-0',
          containerClassName,
        )}
      >
        <Comment className={commentClassName} comment={comment} />
        {after}
      </div>
    ))}
  </>
);
