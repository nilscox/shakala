import classNames from 'classnames';
import { useState } from 'react';

import { Markdown } from '~/components/elements/markdown';

import { Comment as CommentType } from '../../../types';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { RepliesList } from './replies-list';
import { useHighlightComment } from './useHighlightComment';

export type CommentProps = {
  comment: CommentType;
};

export const Comment = ({ comment }: CommentProps): JSX.Element => {
  const { id, author, date, text, upvotes, downvotes, replies } = comment;
  const highlight = useHighlightComment(comment);
  const [showActions, setShowActions] = useState(false);

  return (
    <div id={id} className="p-0 card">
      <div
        className={classNames('p-2', highlight && 'animate-highlight')}
        onMouseLeave={() => setShowActions(false)}
      >
        <CommentHeader commentId={id} author={author} date={date} />
        <Markdown markdown={text} className="my-2" />
        <CommentFooter
          isReply={false}
          upvotes={upvotes}
          downvotes={downvotes}
          showActions={showActions}
          onShowActions={() => setShowActions(true)}
        />
      </div>
      <RepliesList replies={replies} />
    </div>
  );
};
