import { ReplyDto } from '@shakala/shared';
import { clsx } from 'clsx';

import { useBoolean } from '~/hooks/use-boolean';

import { CommentEditionForm } from '../comment-form/comment-edition-form';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { useHighlightComment } from './use-highlight-comment';

type ReplyProps = {
  reply: ReplyDto;
};

export const Reply = ({ reply }: ReplyProps) => {
  const [showActions, openActions, closeActions] = useBoolean(false);
  const [isEditing, openEdition, closeEdition] = useBoolean(false);

  const isHighlighted = useHighlightComment(reply.id);

  return (
    <div
      id={reply.id}
      className={clsx('first-of-type:pt-2', isHighlighted && 'animate-highlight')}
      onMouseLeave={closeActions}
    >
      <CommentHeader comment={reply} className="px-2" />

      {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
      <div className={clsx(!isEditing && 'relative mt-1 ml-[1.3rem] border-l-4 px-2')}>
        {isEditing && <CommentEditionForm comment={reply} onClose={closeEdition} />}

        {/* <Markdown markdown={text} highlight={searchQuery} className={clsx(isEditing && 'hidden')} /> */}
        <div className={clsx('m-2', isEditing && 'hidden')}>{reply.text}</div>

        <CommentFooter
          className={clsx('mt-0.5', isEditing && '!hidden')}
          comment={reply}
          showActions={showActions}
          onShowActions={openActions}
          isEditing={isEditing}
          onEdit={openEdition}
        />
      </div>
    </div>
  );
};
