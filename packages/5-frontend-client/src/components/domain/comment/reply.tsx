import clsx from 'clsx';
import { Reply as ReplyType } from 'frontend-domain';
import { useState } from 'react';

import { Markdown } from '~/components/elements/markdown';
import { useUser } from '~/hooks/use-user';

import { RealCommentForm } from '../comment-form/comment-form';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { useHighlightComment } from './useHighlightComment';

type ReplyProps = {
  reply: ReplyType;
};

export const Reply = ({ reply }: ReplyProps) => {
  const { id, author, date, upvotes, downvotes, text } = reply;

  const highlight = useHighlightComment(reply);
  const [showActions, setShowActions] = useState(false);
  const [editing, setEditing] = useState(false);

  const user = useUser();
  const isAuthor = user?.id === author.id;

  return (
    <div
      id={id}
      className={clsx('first-of-type:pt-2', highlight && 'animate-highlight')}
      onMouseLeave={() => setShowActions(false)}
    >
      <CommentHeader commentId={id} author={author} date={date} className="px-2" />

      <div className={clsx(!editing && 'relative left-[-2px] px-2 mt-1 ml-4 border-l-4')}>
        {editing && (
          <RealCommentForm
            commentId={id}
            initialText={text}
            onCancel={() => setEditing(false)}
            onSubmitted={() => setEditing(false)}
          />
        )}

        <Markdown markdown={text} className={clsx(editing && 'hidden')} />

        <CommentFooter
          isReply
          commentId={id}
          className={clsx('mt-0.5', editing && 'hidden')}
          upvotes={upvotes}
          downvotes={downvotes}
          showActions={showActions}
          onShowActions={() => setShowActions(true)}
          onEdit={isAuthor ? () => setEditing(true) : undefined}
        />
      </div>
    </div>
  );
};
