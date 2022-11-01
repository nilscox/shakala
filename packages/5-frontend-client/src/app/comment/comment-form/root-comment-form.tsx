import {
  createRootComment,
  selectCanSubmitRootComment,
  selectCreateRootCommentFormText,
  selectIsSubmittingRootCommentForm,
  setCreateRootCommentText,
  User,
} from 'frontend-domain';

import { useAppSelector } from '~/hooks/use-app-selector';
import { useAppDispatch } from '~/hooks/use-app-dispatch';

import { CommentForm } from './comment-form';

type RootCommentFormProps = {
  threadId: string;
  author: User;
};

export const RootCommentForm = ({ threadId, author }: RootCommentFormProps) => {
  const dispatch = useAppDispatch();

  const message = useAppSelector(selectCreateRootCommentFormText, threadId);
  const canSubmit = useAppSelector(selectCanSubmitRootComment, threadId);
  const isSubmitting = useAppSelector(selectIsSubmittingRootCommentForm, threadId);

  return (
    <CommentForm
      autofocus={false}
      placeholder={`Répondre à ${author.nick}`}
      message={message}
      setMessage={(text) => dispatch(setCreateRootCommentText(threadId, text))}
      canSubmit={canSubmit}
      isSubmitting={isSubmitting}
      onSubmit={() => dispatch(createRootComment(threadId))}
    />
  );
};
