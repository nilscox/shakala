import { createRootComment, setCreateRootCommentText, User } from 'frontend-domain';

import { useDispatch } from '~/hooks/use-dispatch';

import { CommentForm } from './comment-form';

type RootCommentFormProps = {
  threadId: string;
  author: User;
};

export const RootCommentForm = ({ threadId, author }: RootCommentFormProps) => {
  const dispatch = useDispatch();

  // todo
  // const message = useSelector(selectCreateRootCommentFormText, threadId);
  // const canSubmit = useSelector(selectCanSubmitRootComment, threadId);
  // const isSubmitting = useSelector(selectIsSubmittingRootCommentForm, threadId);

  const message = '';
  const canSubmit = false;
  const isSubmitting = false;

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
