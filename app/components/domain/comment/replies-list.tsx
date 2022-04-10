import { Comment as CommentType } from '~/types';

import { CommentsList } from './comments-list';

type RepliesListProps = {
  replies: CommentType[];
};

export const RepliesList = ({ replies }: RepliesListProps) => (
  <CommentsList
    comments={replies}
    containerClassName="relative ml-1"
    after={<ReplyArrow className="absolute top-4 -left-4 mt-2 stroke-light-gray" />}
  />
);

type ReplyArrowProps = {
  className?: string;
};

const ReplyArrow = ({ className }: ReplyArrowProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M 0 0 c 2 9 7 12 13 12 h 8 M 20 12 l -8 -7 M 20 12 l -8 6"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);
