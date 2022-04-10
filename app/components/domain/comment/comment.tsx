import { useCallback, useState } from 'react';

import { Markdown } from '~/components/elements/markdown';

import { Comment as CommentType } from '../../../types';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { RepliesList } from './replies-list';

export type CommentProps = {
  className?: string;
  comment: CommentType;
};

export const Comment = ({ className, comment }: CommentProps): JSX.Element => {
  const { author, date, text, upvotes, downvotes, repliesCount, repliesOpen, replies } = comment;

  const [hover, setHover] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHover(false);
    setShowActions(false);
  }, []);

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={className}>
        <CommentHeader author={author} date={date} />

        <Markdown markdown={text} />

        <CommentFooter
          upvotes={upvotes}
          downvotes={downvotes}
          repliesCount={repliesCount}
          repliesOpen={repliesOpen}
          hover={hover}
          showActions={showActions}
          onShowActions={() => setShowActions(true)}
        />
      </div>

      {repliesOpen && <RepliesList replies={replies} />}
    </>
  );
};
