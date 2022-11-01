import { clsx } from 'clsx';
import {
  clearReplyForm,
  createReply,
  selectCanSubmitReply,
  selectIsReplying,
  selectIsSubmittingReply,
  selectReplyFormText,
  setIsReplying,
  setReplyFormText,
} from 'frontend-domain';

import { Avatar } from '~/elements/avatar/avatar';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';
import { useUser } from '~/hooks/use-user';

import { CommentForm } from './comment-form';

type ReplyFormPros = {
  parentId: string;
};

export const ReplyForm = ({ parentId }: ReplyFormPros) => {
  const dispatch = useAppDispatch();

  const message = useAppSelector(selectReplyFormText, parentId);
  const isReplying = useAppSelector(selectIsReplying, parentId);
  const canSubmit = useAppSelector(selectCanSubmitReply, parentId);
  const isSubmitting = useAppSelector(selectIsSubmittingReply, parentId);

  if (!isReplying) {
    return <FakeForm onFocus={() => dispatch(setIsReplying(parentId, true))} />;
  }

  return (
    <CommentForm
      message={message as string}
      setMessage={(text) => dispatch(setReplyFormText(parentId, text))}
      canSubmit={canSubmit}
      isSubmitting={isSubmitting as boolean}
      onCancel={() => dispatch(clearReplyForm(parentId))}
      onSubmit={() => dispatch(createReply(parentId))}
    />
  );
};

type FakeFormProps = {
  className?: string;
  onFocus: () => void;
};

const FakeForm = ({ className, onFocus }: FakeFormProps) => {
  const user = useUser();

  return (
    <form className={clsx('row items-center gap-1 p-2', className)}>
      <Avatar image={user?.profileImage} />
      <input
        readOnly
        className="w-full rounded border py-0.5 px-1"
        placeholder="Répondre"
        onFocus={onFocus}
      />
    </form>
  );
};
