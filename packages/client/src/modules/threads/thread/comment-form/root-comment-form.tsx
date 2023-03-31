import { ThreadDto } from '@shakala/shared';
import { useInjection } from 'brandi-react';

import { TOKENS } from '~/app/tokens';
import { usePathname } from '~/hooks/use-pathname';

import { CommentForm } from './comment-form';

type RootCommentFormProps = {
  thread: ThreadDto;
};

export const RootCommentForm = ({ thread }: RootCommentFormProps) => {
  const router = useInjection(TOKENS.router);
  const commentAdapter = useInjection(TOKENS.comment);
  const pathname = usePathname();

  return (
    <CommentForm
      initialText=""
      autofocus={false}
      placeholder={`Répondre à ${thread.author.nick}`}
      onSubmit={(text: string) => commentAdapter.createComment(thread.id, text)}
      onSubmitted={(commentId) => router.navigate(`${pathname}#${commentId}`)}
    />
  );
};
