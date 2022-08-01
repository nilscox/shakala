import {
  editComment,
  selectCanSubmitEditCommentForm,
  selectEditCommentFormText,
  selectIsEditingComment,
  selectIsSubmittingCommentEditionForm,
  setEditCommentFormText,
  setIsEditingComment,
} from 'frontend-domain';

import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

import { CommentForm } from '../comment-form/comment-form';

type CommentEditionFormProps = {
  commentId: string;
};

export const CommentEditionForm = ({ commentId }: CommentEditionFormProps) => {
  const dispatch = useDispatch();

  const isEditing = useSelector(selectIsEditingComment, commentId);
  const message = useSelector(selectEditCommentFormText, commentId);
  const canSubmit = useSelector(selectCanSubmitEditCommentForm, commentId);
  const isSubmitting = useSelector(selectIsSubmittingCommentEditionForm, commentId);

  if (!isEditing) {
    return null;
  }

  return (
    <CommentForm
      message={message as string}
      setMessage={(message) => dispatch(setEditCommentFormText(commentId, message))}
      canSubmit={canSubmit}
      isSubmitting={isSubmitting as boolean}
      onCancel={() => dispatch(setIsEditingComment(commentId, false))}
      onSubmit={() => dispatch(editComment(commentId))}
    />
  );
};
