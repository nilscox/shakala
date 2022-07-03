import {
  User,
  selectRootCommentFormText,
  selectCanSubmitRootComment,
  selectIsSubmittingRootComment,
  createRootComment,
} from 'frontend-domain';
import { setCreateRootCommentText } from 'frontend-domain/src/thread/thread.actions';

import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

import { CommentForm } from './comment-form';

type RootCommentFormProps = {
  threadId: string;
  author: User;
};

export const RootCommentForm = ({ threadId, author }: RootCommentFormProps) => {
  const dispatch = useDispatch();

  const message = useSelector(selectRootCommentFormText, threadId);
  const canSubmit = useSelector(selectCanSubmitRootComment, threadId);
  const isSubmitting = useSelector(selectIsSubmittingRootComment, threadId);

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
