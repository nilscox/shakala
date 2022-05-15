import classNames from 'classnames';
import { useState } from 'react';

import { Markdown } from '~/components/elements/markdown';
import { Comment } from '~/types';

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

  return (
    <div
      id={id}
      className={classNames('px-2 first-of-type:pt-2', highlight && 'animate-highlight')}
      onMouseLeave={() => setShowActions(false)}
    >
      <CommentHeader commentId={id} author={author} date={date} />
      <div className="relative left-[-2px] pl-2 mt-1 ml-2 border-l-4 border-light-gray">
        <Markdown markdown={text} />
        <CommentFooter
          isReply
          upvotes={upvotes}
          downvotes={downvotes}
          showActions={showActions}
          onShowActions={() => setShowActions(true)}
        />
      </div>
    </div>
  );
};
