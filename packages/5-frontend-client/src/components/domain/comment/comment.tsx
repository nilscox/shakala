import clsx from 'clsx';
import { selectComment, selectIsEditingComment } from 'frontend-domain';
import { useState } from 'react';

import { Markdown } from '~/components/elements/markdown';
import { useSelector } from '~/hooks/use-selector';

import { CommentEditionForm } from '../comment-form';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { RepliesList } from './replies-list';
import { useHighlightComment } from './useHighlightComment';

export type CommentProps = {
  commentId: string;
};

export const Comment = ({ commentId }: CommentProps) => {
  const { id, text } = useSelector(selectComment, commentId);
  const isEditing = useSelector(selectIsEditingComment, id);

  const highlight = useHighlightComment(commentId);
  const [showActions, setShowActions] = useState(false);

  return (
    <div id={id} className="p-0 card">
      <div
        className={clsx(highlight && 'animate-highlight')}
        onMouseLeave={() => setShowActions(false)}
      >
        <CommentHeader commentId={id} className="px-2 pt-2" />

        {isEditing && <CommentEditionForm commentId={id} />}

        <Markdown markdown={text} className={clsx('m-2', isEditing && 'hidden')} />

        <CommentFooter
          className={clsx('px-2 pb-1', isEditing && 'hidden')}
          commentId={id}
          showActions={showActions}
          onShowActions={() => setShowActions(true)}
        />
      </div>

      <RepliesList commentId={id} />
    </div>
  );
};
