import clsx from 'clsx';
import { Reply as ReplyType } from 'frontend-domain';

import { CommentForm, FormType } from '../comment-form';

import { Reply } from './reply';

type RepliesListProps = {
  commentId: string;
  replies: ReplyType[];
  replyForm: FormType;
  setReplyForm: (form: FormType) => void;
};

export const RepliesList = ({ commentId, replies, replyForm, setReplyForm }: RepliesListProps) => (
  // eslint-disable-next-line tailwindcss/no-arbitrary-value
  <div className="gap-1 bg-[#F7F7FA] rounded-b border-t col">
    {replies.map((reply) => (
      <Reply key={reply.id} reply={reply} />
    ))}
    <div className={clsx(replies.length > 0 && 'border-t')}>
      <CommentForm parentId={commentId} form={replyForm} setForm={setReplyForm} />
    </div>
  </div>
);
