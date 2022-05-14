import { Comment as CommentType } from '~/types';

import { Reply } from './reply';

type RepliesListProps = {
  replies: CommentType[];
};

export const RepliesList = ({ replies }: RepliesListProps) => {
  if (replies.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 py-2 bg-[#F6F6F9] rounded-b border-t border-light-gray">
      {replies.map((reply) => (
        <Reply key={reply.id} reply={reply} />
      ))}
    </div>
  );
};
