import classNames from 'classnames';

import { Comment as CommentType } from '~/types';

import { CommentForm, FormType } from '../comment-form';

import { Reply } from './reply';

type RepliesListProps = {
  commentId: string;
  replies: CommentType[];
  replyForm: FormType;
  setReplyForm: (form: FormType) => void;
};

export const RepliesList = ({ commentId, replies, replyForm, setReplyForm }: RepliesListProps) => (
  <div className="flex flex-col gap-1 bg-replies-background rounded-b border-t">
    {replies.map((reply) => (
      <Reply key={reply.id} reply={reply} />
    ))}
    <div className={classNames(replies.length > 0 && 'border-t')}>
      <CommentForm parentId={commentId} form={replyForm} setForm={setReplyForm} />
    </div>
  </div>
);
