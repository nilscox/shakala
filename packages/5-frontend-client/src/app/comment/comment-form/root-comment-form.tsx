import { threadActions, User } from '@shakala/frontend-domain';
import { useEffect, useState } from 'react';

import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';

import { CommentForm } from './comment-form';

type RootCommentFormProps = {
  threadId: string;
  author: User;
};

export const RootCommentForm = ({ threadId, author }: RootCommentFormProps) => {
  const dispatch = useAppDispatch();

  const [initialText, setInitialText] = useState<string>();

  useEffect(() => {
    dispatch(threadActions.getInitialDraftRootComment(threadId, setInitialText));
  }, [dispatch, threadId]);

  const canSubmit = useAppSelector(() => true); // todo

  if (initialText === undefined) {
    return null;
  }

  return (
    <CommentForm
      initialText={initialText}
      autofocus={false}
      placeholder={`Répondre à ${author.nick}`}
      canSubmit={canSubmit}
      onTextChange={(text) => dispatch(threadActions.saveDraftRootComment(threadId, text))}
      onSubmit={({ text }) => dispatch(threadActions.createRootComment(threadId, text))}
    />
  );
};
