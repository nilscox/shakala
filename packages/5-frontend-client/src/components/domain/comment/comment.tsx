import clsx from 'clsx';
import {
  Comment as CommentType,
  selectCommentReplies,
  selectCommentThreadId,
  selectIsEditingComment,
} from 'frontend-domain';
import { useState } from 'react';

import { Markdown } from '~/components/elements/markdown';
import { useSelector } from '~/hooks/use-selector';

import { CommentForm } from '../comment-form/comment-form';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { RepliesList } from './replies-list';
import { useHighlightComment } from './useHighlightComment';

export type CommentProps = {
  comment: CommentType;
};

export const Comment = ({ comment }: CommentProps) => {
  const { id, author, date, text } = comment;
  const threadId = useSelector(selectCommentThreadId, id);
  const replies = useSelector(selectCommentReplies, id);
  const isEditing = useSelector(selectIsEditingComment, id);

  const highlight = useHighlightComment(comment);
  const [showActions, setShowActions] = useState(false);

  return (
    <div id={id} className="p-0 card">
      <div className={clsx(highlight && 'animate-highlight')} onMouseLeave={() => setShowActions(false)}>
        <CommentHeader commentId={id} author={author} date={date} className="px-2 pt-2" />

        {/* {isEditing && <CommentForm threadId={threadId} commentId={comment.id} />} */}

        <Markdown markdown={text} className={clsx('m-2', isEditing && 'hidden')} />

        <CommentFooter
          className={clsx('px-2 pb-1', isEditing && 'hidden')}
          commentId={id}
          isReply={false}
          showActions={showActions}
          onShowActions={() => setShowActions(true)}
        />
      </div>

      <RepliesList threadId={threadId} commentId={id} replies={replies} />
    </div>
  );
};
