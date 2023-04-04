import { ThreadDto } from '@shakala/shared';
import { useInjection } from 'brandi-react';

import { TOKENS } from '~/app/tokens';
import { UserAvatarNick } from '~/app/user-avatar-nick';
import { SubmitButton } from '~/elements/button';
import { EditorToolbar, RichTextEditor } from '~/elements/rich-text-editor';
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

  return (
    <form onSubmit={onSubmit} className="col flex-1 bg-neutral">
      <div className="row justify-between gap-4 p-2">
        <UserAvatarNick />
        <EditorToolbar editor={editor} />
      </div>

      <RichTextEditor editor={editor} className="min-h-1 px-1" />

      <div className="flex flex-row items-center justify-end gap-2 py-1 px-2">
        {error}

        <SubmitButton primary loading={loading}>
          Envoyer
        </SubmitButton>
      </div>
    </form>
  );
};
