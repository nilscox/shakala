import { RootCommentDto } from '@shakala/shared';
import clsx from 'clsx';
import { useState } from 'react';

import { useBoolean } from '~/hooks/use-boolean';

import { CommentEditionForm } from '../comment-form/comment-edition-form';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { RepliesList } from './replies-list';
import { useHighlightComment } from './use-highlight-comment';

type CommentProps = {
  comment: RootCommentDto;
};

export const Comment = ({ comment }: CommentProps) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, openEditionForm, closeEditionForm] = useBoolean(false);
  const [isReplying, openReplyForm, closeReplyForm] = useBoolean(false);

  const isHighlighted = useHighlightComment(comment.id);

  return (
    <div id={comment.id} className="comment card">
      <div className={clsx(isHighlighted && 'animate-highlight')} onMouseLeave={() => setShowActions(false)}>
        <CommentHeader comment={comment} className="px-2 pt-2" />

        {isEditing && <CommentEditionForm comment={comment} onClose={closeEditionForm} />}

        {/* <Markdown markdown={text} highlight={searchQuery} className={clsx('m-2', isEditing && 'hidden')} /> */}
        <div className={clsx('m-2', isEditing && 'hidden')}>{comment.text}</div>

        <CommentFooter
          className={clsx('px-2 pb-1', isEditing && 'hidden')}
          comment={comment}
          isEditing={isEditing}
          onEdit={openEditionForm}
          onReply={openReplyForm}
          showActions={showActions}
          onShowActions={() => setShowActions(true)}
        />
      </div>

      <RepliesList
        parent={comment}
        isReplying={isReplying}
        openReplyForm={openReplyForm}
        closeReplyForm={closeReplyForm}
      />
    </div>
  );
};
