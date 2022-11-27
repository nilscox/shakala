import { clsx } from 'clsx';
import { commentSelectors } from 'frontend-domain';

import { useAppSelector } from '~/hooks/use-app-selector';

import { ReplyForm } from '../comment-form/reply-form';

import { Reply } from './reply';

type RepliesListProps = {
  commentId: string;
};

export const RepliesList = ({ commentId }: RepliesListProps) => {
  const { replies } = useAppSelector(commentSelectors.byId, commentId);

  return (
    // eslint-disable-next-line tailwindcss/no-arbitrary-value
    <div className="col gap-1 rounded-b border-t bg-[#F7F7FA]">
      {replies.map(({ id: replyId }) => (
        <Reply key={replyId} replyId={replyId} />
      ))}

      <div className={clsx(replies.length > 0 && 'border-t')}>
        <ReplyForm parentId={commentId} />
      </div>
    </div>
  );
};
