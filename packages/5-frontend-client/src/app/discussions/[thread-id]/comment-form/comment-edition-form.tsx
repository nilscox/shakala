import { clearEditCommentFormText, editComment, setEditCommentFormText } from 'frontend-domain';

import { useDispatch } from '~/hooks/use-dispatch';

import { CommentForm } from '../comment-form/comment-form';

type CommentEditionFormProps = {
  commentId: string;
};

export const CommentEditionForm = ({ commentId }: CommentEditionFormProps) => {
  const dispatch = useDispatch();

  // todo
  // const isEditing = useSelector(selectIsEditingComment, commentId);
  // const message = useSelector(selectEditCommentFormText, commentId);
  // const canSubmit = useSelector(selectCanSubmitEditCommentForm, commentId);
  // const isSubmitting = useSelector(selectIsSubmittingCommentEditionForm, commentId);

  const isEditing = false;
  const message = '';
  const canSubmit = false;
  const isSubmitting = false;

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
