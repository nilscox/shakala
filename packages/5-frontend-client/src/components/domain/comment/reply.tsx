import clsx from 'clsx';
import { Comment, selectCommentThreadId, selectIsEditingComment } from 'frontend-domain';
import { useState } from 'react';

import { Markdown } from '~/components/elements/markdown';
import { useSelector } from '~/hooks/use-selector';

import { CommentForm } from '../comment-form/comment-form';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { useHighlightComment } from './useHighlightComment';

type ReplyProps = {
  reply: Comment;
};

export const Reply = ({ reply }: ReplyProps) => {
  const { id, author, date, text } = reply;
  const threadId = useSelector(selectCommentThreadId, id);
  const isEditing = useSelector(selectIsEditingComment, id);

  const highlight = useHighlightComment(reply);
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      id={id}
      className={clsx('first-of-type:pt-2', highlight && 'animate-highlight')}
      onMouseLeave={() => setShowActions(false)}
    >
      <CommentHeader commentId={id} author={author} date={date} className="px-2" />

      {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
      <div className={clsx(!isEditing && 'relative left-[-2px] px-2 mt-1 ml-4 border-l-4')}>
        {/* {isEditing && <CommentForm threadId={threadId} commentId={id} />} */}

        <Markdown markdown={text} className={clsx(isEditing && 'hidden')} />

        <CommentFooter
          isReply
          commentId={id}
          className={clsx('mt-0.5', isEditing && 'hidden')}
          showActions={showActions}
          onShowActions={() => setShowActions(true)}
        />
      </div>
    </div>
  );
};
