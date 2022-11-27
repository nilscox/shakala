import { clsx } from 'clsx';
import { commentActions, commentSelectors } from 'frontend-domain';
import { useEffect, useState } from 'react';

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

  const [initialText, setInitialText] = useState<string>();

  const isReplying = useAppSelector(commentSelectors.isReplying, parentId);
  const canSubmit = useAppSelector(() => true); // todo

  useEffect(() => {
    if (isReplying) {
      dispatch(commentActions.getInitialReplyText(parentId, setInitialText));
    }
  }, [dispatch, parentId, isReplying]);

  if (!isReplying || initialText === undefined) {
    return <FakeForm onFocus={() => dispatch(commentActions.setReplying(parentId, true))} />;
  }

  return (
    <CommentForm
      initialText={initialText}
      canSubmit={canSubmit}
      onTextChange={(text) => dispatch(commentActions.saveDraftReply(parentId, text))}
      onCancel={() => dispatch(commentActions.closeReplyForm(parentId))}
      onSubmit={({ text }) => dispatch(commentActions.createReply(parentId, text))}
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
