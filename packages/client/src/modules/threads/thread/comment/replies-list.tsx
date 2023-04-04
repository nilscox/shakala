import { RootCommentDto } from '@shakala/shared';
import clsx from 'clsx';

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
  <div className={clsx('col rounded-b border-t bg-[#F7F7FA]', parent.replies.length > 0 && 'pt-0.5')}>
    {parent.replies.map((reply) => (
      <Reply key={reply.id} reply={reply} />
    ))}

    <ReplyForm
      parent={parent}
      isReplying={isReplying}
      openReplyForm={openReplyForm}
      closeReplyForm={closeReplyForm}
    />
  </div>
);
