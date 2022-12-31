import { commentActions, commentSelectors } from '@shakala/frontend-domain';
import { useState, useEffect } from 'react';

import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';

import { CommentForm } from '../comment-form/comment-form';

type CommentEditionFormProps = {
  commentId: string;
};

export const CommentEditionForm = ({ commentId }: CommentEditionFormProps) => {
  const dispatch = useAppDispatch();

  const [initialText, setInitialText] = useState<string>();

  const isEditing = useAppSelector(commentSelectors.isEditing, commentId);
  const canSubmit = useAppSelector(() => true); // todo

  useEffect(() => {
    if (isEditing) {
      dispatch(commentActions.getInitialEditionText(commentId, setInitialText));
    }
  }, [dispatch, commentId, isEditing]);

  if (!isEditing || initialText === undefined) {
    return null;
  }

  return (
    <CommentForm
      initialText={initialText}
      canSubmit={canSubmit}
      onTextChange={(text) => dispatch(commentActions.saveDraftEditionText(commentId, text))}
      onCancel={() => dispatch(commentActions.closeEditionForm(commentId))}
      onSubmit={({ text }) => dispatch(commentActions.editComment(commentId, text))}
    />
  );
};
