import { RootCommentDto } from '@shakala/shared';
import { useInjection } from 'brandi-react';
import clsx from 'clsx';
import { useState } from 'react';

import { TOKENS } from '~/app/tokens';
import { Button, SubmitButton } from '~/elements/button';
import { RichText } from '~/elements/rich-text';
import { EditorToolbar, RichTextEditor } from '~/elements/rich-text-editor';
import { useBoolean } from '~/hooks/use-boolean';

import { useCommentForm } from '../comment-form/comment-form';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { RepliesList } from './replies-list';
import { useHighlightComment } from './use-highlight-comment';

type CommentProps = {
  comment: RootCommentDto;
};

export const Comment = ({ comment }: CommentProps) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, openEditionForm, closeEditionForm] = useBoolean(false);
  const [isReplying, openReplyForm, closeReplyForm] = useBoolean(false);

  const isHighlighted = useHighlightComment(comment.id);

  return (
    <div id={comment.id} className="comment card">
      {isEditing ? (
        <CommentEditionForm comment={comment} onClose={closeEditionForm} />
      ) : (
        <div
          className={clsx('p-2', isHighlighted && 'animate-highlight')}
          onMouseLeave={() => setShowActions(false)}
        >
          <CommentHeader comment={comment} />
          <RichText className="my-2">{comment.text}</RichText>
          <CommentFooter
            comment={comment}
            isEditing={isEditing}
            onEdit={openEditionForm}
            onReply={openReplyForm}
            showActions={showActions}
            onShowActions={() => setShowActions(true)}
          />
        </div>
      )}

      <RepliesList
        parent={comment}
        isReplying={isReplying}
        openReplyForm={openReplyForm}
        closeReplyForm={closeReplyForm}
      />
    </div>
  );
};

type CommentEditionFormProps = {
  comment: RootCommentDto;
  onClose: () => void;
};

export const CommentEditionForm = ({ comment, onClose }: CommentEditionFormProps) => {
  const commentAdapter = useInjection(TOKENS.comment);

  const { editor, loading, error, onSubmit } = useCommentForm({
    autofocus: true,
    initialHtml: comment.text,
    onCancel: onClose,
    onSubmitted: onClose,
    onSubmit: async (text) => {
      await commentAdapter.editComment(comment.id, text);
      return comment.id;
    },
  });

  return (
    <form onSubmit={onSubmit} className="col flex-1 p-2">
      <div className="row justify-between gap-4">
        <CommentHeader comment={comment} />
        <EditorToolbar editor={editor} />
      </div>

      <div className="my-2">
        {editor ? <RichTextEditor editor={editor} /> : <RichText>{comment.text}</RichText>}
      </div>

      <div className="flex flex-row items-center justify-end gap-2">
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
