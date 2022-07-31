import {
  editComment,
  selectCanSubmitEditCommentForm,
  selectEditCommentFormText,
  selectIsSubmittingCommentEditionForm,
  setCommentEditionFormText,
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

  const message = useSelector(selectEditCommentFormText, commentId);
  const canSubmit = useSelector(selectCanSubmitEditCommentForm, commentId);
  const isSubmitting = useSelector(selectIsSubmittingCommentEditionForm, commentId);

  return (
    <CommentForm
      message={message as string}
      setMessage={(message) => dispatch(setCommentEditionFormText(commentId, message))}
      canSubmit={canSubmit}
      isSubmitting={isSubmitting as boolean}
      onCancel={() => dispatch(setIsEditingComment(commentId, false))}
      onSubmit={() => dispatch(editComment(commentId))}
    />
  );
};
