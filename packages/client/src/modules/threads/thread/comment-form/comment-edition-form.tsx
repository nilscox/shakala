import { CommentDto, ReplyDto } from '@shakala/shared';
import { useInjection } from 'brandi-react';

import { TOKENS } from '~/app/tokens';

import { CommentForm } from './comment-form';

type CommentEditionFormProps = {
  comment: CommentDto | ReplyDto;
  onClose: () => void;
};

export const CommentEditionForm = ({ comment, onClose }: CommentEditionFormProps) => {
  const commentAdapter = useInjection(TOKENS.comment);

  return (
    <CommentForm
      initialText={comment.text}
      onCancel={onClose}
      onSubmit={async (text: string) => {
        await commentAdapter.editComment(comment.id, text);
        return comment.id;
      }}
      onSubmitted={onClose}
    />
  );
};
