import { Comment as CommentType } from '~/types';

import { CommentsList } from './comments-list';

type RepliesListProps = {
  replies: CommentType[];
};

export const RepliesList = ({ replies }: RepliesListProps) => (
  <CommentsList
    comments={replies}
    containerClassName="relative ml-4"
    after={<ReplyArrow className="absolute top-[-16px] left-[-32px] mt-2 stroke-light-gray" />}
  />
);

type ReplyArrowProps = {
  className?: string;
};

const ReplyArrow = ({ className }: ReplyArrowProps) => (
  <svg width="29" height="28" viewBox="-2 -2 26 26" fill="none" className={className}>
    <path d="M 0 0 c 0 10 8 14 15 14 h 8 m 0 0 l -8 -7 m 8 7 l -8 6" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
