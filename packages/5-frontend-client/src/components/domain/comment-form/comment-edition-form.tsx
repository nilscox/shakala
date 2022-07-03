import {
  editComment,
  selectCanSubmitCommentEdition,
  selectCommentEditionText,
  selectIsSubmittingCommentEdition,
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

  const message = useSelector(selectCommentEditionText, commentId);
  const canSubmit = useSelector(selectCanSubmitCommentEdition, commentId);
  const isSubmitting = useSelector(selectIsSubmittingCommentEdition, commentId);

  return (
    <CommentForm
      message={message as string}
      setMessage={(message) => dispatch(setCommentEditionFormText(commentId, message))}
      canSubmit={canSubmit}
      isSubmitting={isSubmitting as boolean}
      onCancel={() => dispatch(setIsEditingComment(commentId, false))}
      onSubmit={() => dispatch(editComment(commentId, message as string))}
    />
  );
};
