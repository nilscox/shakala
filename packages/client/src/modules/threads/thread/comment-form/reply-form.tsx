import { CommentDto } from '@shakala/shared';
import { useInjection } from 'brandi-react';
import { clsx } from 'clsx';

import { TOKENS } from '~/app/tokens';
import { UserAvatarNick } from '~/app/user-avatar-nick';
import { Avatar } from '~/elements/avatar/avatar';
import { Button, SubmitButton } from '~/elements/button';
import { useUser } from '~/hooks/use-user';

import { useCommentForm } from './comment-form';

type ReplyFormPros = {
  parent: CommentDto;
  isReplying: boolean;
  openReplyForm: () => void;
  closeReplyForm: () => void;
};

export const ReplyForm = ({ isReplying, openReplyForm, ...props }: ReplyFormPros) => {
  if (!isReplying) {
    return <FakeForm onFocus={openReplyForm} />;
  }

  return <RealForm {...props} />;
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
        className="w-full rounded border px-1 py-0.5"
        placeholder="Répondre"
        onFocus={onFocus}
      />
    </form>
  );
};

type RealFormPros = {
  parent: CommentDto;
  closeReplyForm: () => void;
};

const RealForm = ({ parent, closeReplyForm }: RealFormPros) => {
  const commentAdapter = useInjection(TOKENS.comment);

  const { editor, loading, error, onSubmit } = useCommentForm({
    autofocus: true,
    placeholder: 'Rédigez votre message',
    onCancel: closeReplyForm,
    onSubmitted: closeReplyForm,
    onSubmit: (text) => commentAdapter.createReply(parent.id, text),
  });

  const { Editor, Toolbar } = useInjection(TOKENS.richTextEditor);

  return (
    <form onSubmit={onSubmit} className="px-1 py-0.5">
      <div className="row justify-between gap-4 pb-1">
        <UserAvatarNick />
        <Toolbar editor={editor} />
      </div>

      {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
      <div className={clsx('ml-[0.6rem] border-l-4 pl-2')}>
        <Editor editor={editor} className="min-h-1 rounded border bg-neutral p-1" />
      </div>

      <div className="flex flex-row items-center justify-end gap-2 px-2 py-1">
        {error}

        <Button secondary onClick={closeReplyForm}>
          Annuler
        </Button>

        <SubmitButton primary loading={loading}>
          Envoyer
        </SubmitButton>
      </div>
    </form>
  );
};
