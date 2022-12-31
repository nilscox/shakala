import { clsx } from 'clsx';
import { commentSelectors } from '@shakala/frontend-domain';
import { useState } from 'react';

import { Markdown } from '~/elements/markdown';
import { useAppSelector } from '~/hooks/use-app-selector';
import { useSearchParam } from '~/hooks/use-search-param';

import { CommentEditionForm } from '../comment-form/comment-edition-form';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { useHighlightComment } from './use-highlight-comment';

type ReplyProps = {
  replyId: string;
};

export const Reply = ({ replyId }: ReplyProps) => {
  const { id, text } = useAppSelector(commentSelectors.byId, replyId);
  const isEditing = useAppSelector(commentSelectors.isEditing, id);

  const highlight = useHighlightComment(replyId);
  const [showActions, setShowActions] = useState(false);

  const searchQuery = useSearchParam('search');

  return (
    <div
      id={id}
      className={clsx('first-of-type:pt-2', highlight && 'animate-highlight')}
      onMouseLeave={() => setShowActions(false)}
    >
      <CommentHeader commentId={id} className="px-2" />

      {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
      <div className={clsx(!isEditing && 'relative mt-1 ml-[1.3rem] border-l-4 px-2')}>
        {isEditing && <CommentEditionForm commentId={id} />}

        <Markdown markdown={text} highlight={searchQuery} className={clsx(isEditing && 'hidden')} />

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
