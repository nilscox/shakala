import { clsx } from 'clsx';
import {
  selectReplyFormText,
  selectIsReplying,
  selectCanSubmitReply,
  selectIsSubmittingReply,
  setIsReplying,
  setReplyFormText,
  createReply,
} from 'frontend-domain';

import { Avatar } from '~/components/elements/avatar/avatar';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

import { CommentForm } from './comment-form';

type ReplyFormPros = {
  parentId: string;
};

export const ReplyForm = ({ parentId }: ReplyFormPros) => {
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
      onSubmit={() => dispatch(createReply(parentId))}
    />
  );
};

type FakeFormProps = {
  className?: string;
  onFocus: () => void;
};

const FakeForm = ({ className, onFocus }: FakeFormProps) => (
  <form className={clsx('gap-1 items-center p-2 row', className)}>
    <Avatar />
    <input readOnly className="py-0.5 px-1 w-full rounded border" placeholder="Répondre" onFocus={onFocus} />
  </form>
);
