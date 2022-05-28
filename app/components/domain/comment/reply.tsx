import classNames from 'classnames';
import { useState } from 'react';

import { Markdown } from '~/components/elements/markdown';
import { Comment } from '~/types';
import { useUser } from '~/user.provider';

import { RealCommentForm } from '../comment-form/comment-form';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { useHighlightComment } from './useHighlightComment';

type ReplyProps = {
  reply: Comment;
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
      className={classNames('first-of-type:pt-2', highlight && 'animate-highlight')}
      onMouseLeave={() => setShowActions(false)}
    >
      <CommentHeader commentId={id} author={author} date={date} className="px-2" />

      <div className={classNames(!editing && 'relative left-[-2px] px-2 mt-1 ml-4 border-l-4')}>
        {editing && (
          <RealCommentForm
            commentId={id}
            initialText={text}
            onCancel={() => setEditing(false)}
            onSubmitted={() => setEditing(false)}
          />
        )}

        <Markdown markdown={text} className={classNames(editing && 'hidden')} />

        <CommentFooter
          className={classNames('mt-0.5', editing && 'hidden')}
          commentId={id}
          isReply
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
