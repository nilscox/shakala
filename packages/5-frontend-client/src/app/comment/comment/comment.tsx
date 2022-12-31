import { commentSelectors } from '@shakala/frontend-domain';
import { clsx } from 'clsx';
import { useState } from 'react';

import { Markdown } from '~/elements/markdown';
import { useAppSelector } from '~/hooks/use-app-selector';
import { useSearchParam } from '~/hooks/use-search-param';

import { CommentEditionForm } from '../comment-form/comment-edition-form';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { RepliesList } from './replies-list';
import { useHighlightComment } from './use-highlight-comment';

export type CommentProps = {
  commentId: string;
};

export const Comment = ({ commentId }: CommentProps) => {
  const { id, text } = useAppSelector(commentSelectors.byId, commentId);
  const isEditing = useAppSelector(commentSelectors.isEditing, id);

  const highlight = useHighlightComment(commentId);
  const [showActions, setShowActions] = useState(false);

  const searchQuery = useSearchParam('search');

  return (
    <div id={id} className="comment card">
      <div className={clsx(highlight && 'animate-highlight')} onMouseLeave={() => setShowActions(false)}>
        <CommentHeader commentId={id} className="px-2 pt-2" />

        {isEditing && <CommentEditionForm commentId={id} />}

        <Markdown markdown={text} highlight={searchQuery} className={clsx('m-2', isEditing && 'hidden')} />

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
