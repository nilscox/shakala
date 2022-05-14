import classNames from 'classnames';

import { Comment as CommentType } from '~/types';

import { Comment } from './comment';

const border = true;

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
        className={classNames('border-l-4 border-light-gray mt-1 first-of-type:mt-0', containerClassName)}
      >
        <Comment
          className={classNames('ml-2', border && 'border-b border-b-light-gray/50', commentClassName)}
          comment={comment}
        />
        {after}
      </div>
    ))}
  </>
);
