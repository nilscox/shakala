import { ThreadDto } from '@shakala/shared';
import { useInjection } from 'brandi-react';

import { TOKENS } from '~/app/tokens';
import { UserAvatarNick } from '~/app/user-avatar-nick';
import { SubmitButton } from '~/elements/button';
import { usePathname } from '~/hooks/use-router';

import { useCommentForm } from './comment-form';

type RootCommentFormProps = {
  thread: ThreadDto;
};

export const RootCommentForm = ({ thread }: RootCommentFormProps) => {
  const router = useInjection(TOKENS.router);
  const commentAdapter = useInjection(TOKENS.comment);
  const pathname = usePathname();

  const { editor, loading, error, onSubmit } = useCommentForm({
    placeholder: `Répondre à ${thread.author.nick}`,
    onSubmit: async (text: string) => {
      return commentAdapter.createComment(thread.id, text);
    },
    onSubmitted: (commentId) => {
      router.navigate(`${pathname}#${commentId}`);
    },
  });

  const { Editor, Toolbar } = useInjection(TOKENS.richTextEditor);

  return (
    <form onSubmit={onSubmit} className="col flex-1 bg-neutral">
      <div className="row justify-between gap-4 p-2">
        <UserAvatarNick />
        <Toolbar editor={editor} />
      </div>

      <Editor editor={editor} className="min-h-1 px-1" />

      <div className="flex flex-row items-center justify-end gap-2 px-2 py-1">
        {error}

        <SubmitButton primary loading={loading}>
          Envoyer
        </SubmitButton>
      </div>
    </form>
  );
};
