import {
  clearEditCommentFormText,
  editComment,
  selectCanSubmitEditCommentForm,
  selectEditCommentFormText,
  selectIsEditingComment,
  selectIsSubmittingCommentEditionForm,
  setEditCommentFormText,
} from 'frontend-domain';

import { useAppSelector } from '~/hooks/use-app-selector';
import { useAppDispatch } from '~/hooks/use-app-dispatch';

import { CommentForm } from '../comment-form/comment-form';

type CommentEditionFormProps = {
  commentId: string;
};

export const CommentEditionForm = ({ commentId }: CommentEditionFormProps) => {
  const dispatch = useAppDispatch();

  const isEditing = useAppSelector(selectIsEditingComment, commentId);
  const message = useAppSelector(selectEditCommentFormText, commentId);
  const canSubmit = useAppSelector(selectCanSubmitEditCommentForm, commentId);
  const isSubmitting = useAppSelector(selectIsSubmittingCommentEditionForm, commentId);

  if (!isEditing) {
    return null;
  }

  return (
    <CommentForm
      message={message as string}
      setMessage={(message) => dispatch(setEditCommentFormText(commentId, message))}
      canSubmit={canSubmit}
      isSubmitting={isSubmitting as boolean}
      onCancel={() => dispatch(clearEditCommentFormText(commentId))}
      onSubmit={() => dispatch(editComment(commentId))}
    />
  );
};
