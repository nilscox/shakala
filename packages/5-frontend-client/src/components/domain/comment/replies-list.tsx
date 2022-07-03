import clsx from 'clsx';
import {
  Comment,
  createReply,
  selectCanSubmitReply,
  selectIsReplying,
  selectIsSubmittingReply,
  selectReplyFormText,
  setIsReplying,
  setReplyFormText,
} from 'frontend-domain';

import { Avatar } from '~/components/elements/avatar/avatar';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

import { CommentForm } from '../comment-form';

import { Reply } from './reply';

type RepliesListProps = {
  threadId: string;
  commentId: string;
  replies: Comment[];
};

export const RepliesList = ({ threadId, commentId, replies }: RepliesListProps) => (
  // eslint-disable-next-line tailwindcss/no-arbitrary-value
  <div className="gap-1 bg-[#F7F7FA] rounded-b border-t col">
    {replies.map((reply) => (
      <Reply key={reply.id} reply={reply} />
    ))}
    <div className={clsx(replies.length > 0 && 'border-t')}>
      <ReplyForm threadId={threadId} parentId={commentId} />
    </div>
  </div>
);

type CommentFormPros = {
  threadId: string;
  parentId: string;
};

export const ReplyForm = ({ threadId, parentId }: CommentFormPros) => {
  const dispatch = useDispatch();

  const message = useSelector(selectReplyFormText, parentId);
  const isReplying = useSelector(selectIsReplying, parentId);
  const canSubmit = useSelector(selectCanSubmitReply, parentId);
  const isSubmitting = useSelector(selectIsSubmittingReply, parentId);

  if (!isReplying) {
    return <FakeForm onFocus={() => dispatch(setIsReplying(parentId))} />;
  }

  return (
    <CommentForm
      message={message as string}
      setMessage={(text) => dispatch(setReplyFormText(parentId, text))}
      canSubmit={canSubmit}
      isSubmitting={isSubmitting as boolean}
      onCancel={() => dispatch(setIsReplying(parentId, false))}
      onSubmit={() => dispatch(createReply(threadId, parentId))}
    />
  );
};

type FakeFormProps = {
  className?: string;
  onFocus: () => void;
};

export const FakeForm = ({ className, onFocus }: FakeFormProps) => (
  <form className={clsx('gap-1 items-center p-2 row', className)}>
    <Avatar />
    <input readOnly className="py-0.5 px-1 w-full rounded border" placeholder="Répondre" onFocus={onFocus} />
  </form>
);
