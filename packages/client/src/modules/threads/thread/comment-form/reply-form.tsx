import { CommentDto } from '@shakala/shared';
import { useInjection } from 'brandi-react';
import { clsx } from 'clsx';

import { TOKENS } from '~/app/tokens';
import { Avatar } from '~/elements/avatar/avatar';
import { useUser } from '~/hooks/use-user';

import { CommentForm } from './comment-form';

type ReplyFormPros = {
  parent: CommentDto;
  isReplying: boolean;
  openReplyForm: () => void;
  closeReplyForm: () => void;
};

export const ReplyForm = ({ parent, isReplying, openReplyForm, closeReplyForm }: ReplyFormPros) => {
  const commentAdapter = useInjection(TOKENS.comment);

  if (!isReplying) {
    return <FakeForm onFocus={openReplyForm} />;
  }

  return (
    <CommentForm
      initialText=""
      onCancel={closeReplyForm}
      onSubmit={(text) => commentAdapter.createReply(parent.id, text)}
      onSubmitted={closeReplyForm}
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
