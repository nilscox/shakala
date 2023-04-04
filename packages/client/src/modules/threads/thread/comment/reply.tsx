import { ReplyDto } from '@shakala/shared';
import { useInjection } from 'brandi-react';
import { clsx } from 'clsx';

import { Button, SubmitButton } from '~/elements/button';
import { RichText } from '~/elements/rich-text';
import { EditorToolbar, RichTextEditor } from '~/elements/rich-text-editor';
import { useBoolean } from '~/hooks/use-boolean';

import { useCommentForm } from '../comment-form/comment-form';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { useHighlightComment } from './use-highlight-comment';

type ReplyProps = {
  reply: ReplyDto;
};

export const Reply = ({ reply }: ReplyProps) => {
  const [showActions, openActions, closeActions] = useBoolean(false);
  const [isEditing, openEdition, closeEdition] = useBoolean(false);

  const isHighlighted = useHighlightComment(reply.id);

  if (isEditing) {
    return <ReplyEditionForm reply={reply} onClose={closeEdition} />;
  }

  return (
    <div
      id={reply.id}
      className={clsx('py-0.5 px-1', isHighlighted && 'animate-highlight')}
      onMouseLeave={closeActions}
    >
      <CommentHeader comment={reply} className="pb-1" />

      {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
      <div className={clsx('ml-[0.6rem] border-l-4 px-2')}>
        <RichText>{reply.text}</RichText>

        <CommentFooter
          className="mt-0.5"
          comment={reply}
          showActions={showActions}
          onShowActions={openActions}
          isEditing={isEditing}
          onEdit={openEdition}
        />
      </div>
    </div>
  );
};

type ReplyEditionFormProps = {
  reply: ReplyDto | ReplyDto;
  onClose: () => void;
};

const ReplyEditionForm = ({ reply, onClose }: ReplyEditionFormProps) => {
  const commentAdapter = useInjection(TOKENS.comment);

  const { editor, loading, error, onSubmit } = useCommentForm({
    autofocus: true,
    initialHtml: reply.text,
    onCancel: onClose,
    onSubmitted: onClose,
    onSubmit: async (text) => {
      await commentAdapter.editComment(reply.id, text);
      return reply.id;
    },
  });

  return (
    <form id={reply.id} className="py-0.5 px-1" onSubmit={onSubmit}>
      <div className="row justify-between gap-4 pb-1">
        <CommentHeader comment={reply} />
        <EditorToolbar editor={editor} />
      </div>

      <div className="ml-[0.6rem] border-l-4 pl-2">
        <RichTextEditor editor={editor} className="min-h-1 rounded border bg-neutral p-1" />
      </div>

      <div className="flex flex-row items-center justify-end gap-2 px-1 pt-1">
        {error}

        <Button secondary onClick={onClose}>
          Annuler
        </Button>

        <SubmitButton primary loading={loading}>
          Envoyer
        </SubmitButton>
      </div>
    </form>
  );
};
