import clsx from 'clsx';
import { selectComment, selectIsEditingComment } from 'frontend-domain';
import { useState } from 'react';

import { Markdown } from '~/components/elements/markdown';
import { useSelector } from '~/hooks/use-selector';

import { CommentEditionForm } from '../comment-form';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { useHighlightComment } from './useHighlightComment';

type ReplyProps = {
  replyId: string;
};

export const Reply = ({ replyId }: ReplyProps) => {
  const { id, text } = useSelector(selectComment, replyId);
  const isEditing = useSelector(selectIsEditingComment, id);

  const highlight = useHighlightComment(replyId);
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      id={id}
      className={clsx('first-of-type:pt-2', highlight && 'animate-highlight')}
      onMouseLeave={() => setShowActions(false)}
    >
      <CommentHeader commentId={id} className="px-2" />

      {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
      <div className={clsx(!isEditing && 'relative px-2 mt-1 ml-[1.3rem] border-l-4')}>
        {isEditing && <CommentEditionForm commentId={id} />}

        <Markdown markdown={text} className={clsx(isEditing && 'hidden')} />

        <CommentFooter
          className={clsx('mt-0.5', isEditing && '!hidden')}
          commentId={id}
          showActions={showActions}
          onShowActions={() => setShowActions(true)}
        />
      </div>
    </div>
  );
};
