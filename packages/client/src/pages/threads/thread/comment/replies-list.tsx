import { RootCommentDto } from '@shakala/shared';
import { clsx } from 'clsx';

import { ReplyForm } from '../comment-form/reply-form';

import { Reply } from './reply';

type RepliesListProps = {
  parent: RootCommentDto;
  isReplying: boolean;
  openReplyForm: () => void;
  closeReplyForm: () => void;
};

export const RepliesList = ({ parent, isReplying, openReplyForm, closeReplyForm }: RepliesListProps) => (
  // eslint-disable-next-line tailwindcss/no-arbitrary-value
  <div className="col gap-1 rounded-b border-t bg-[#F7F7FA]">
    {parent.replies.map((reply) => (
      <Reply key={reply.id} reply={reply} />
    ))}

    <div className={clsx(parent.replies.length > 0 && 'border-t')}>
      <ReplyForm
        parent={parent}
        isReplying={isReplying}
        openReplyForm={openReplyForm}
        closeReplyForm={closeReplyForm}
      />
    </div>
  </div>
);
