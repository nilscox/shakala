import clsx from 'clsx';
import { Comment as CommentType } from 'frontend-domain';
import { useState } from 'react';

import { Markdown } from '~/components/elements/markdown';
import { useUser } from '~/hooks/use-user';

import { FormType } from '../comment-form';
import { RealCommentForm } from '../comment-form/comment-form';

import { CommentFooter } from './comment-footer';
import { CommentHeader } from './comment-header';
import { RepliesList } from './replies-list';
import { useHighlightComment } from './useHighlightComment';

export type CommentProps = {
  comment: CommentType;
};

export const Comment = ({ comment }: CommentProps) => {
  const { id, author, date, text, upvotes, downvotes, replies } = comment;

  const highlight = useHighlightComment(comment);
  const [showActions, setShowActions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [replyForm, setReplyForm] = useState<FormType>(FormType.fake);

  const user = useUser();
  const isAuthor = user?.id === author.id;

  return (
    <div id={id} className="p-0 card">
      <div className={clsx(highlight && 'animate-highlight')} onMouseLeave={() => setShowActions(false)}>
        <CommentHeader commentId={id} author={author} date={date} className="px-2 pt-2" />

        {editing && (
          <RealCommentForm
            commentId={comment.id}
            initialText={text}
            onCancel={() => setEditing(false)}
            onSubmitted={() => setEditing(false)}
          />
        )}

        <Markdown markdown={text} className={clsx('m-2', editing && 'hidden')} />

        <CommentFooter
          className={clsx('px-2 pb-1', editing && 'hidden')}
          commentId={id}
          isReply={false}
          upvotes={upvotes}
          downvotes={downvotes}
          showActions={showActions}
          onShowActions={() => setShowActions(true)}
          onEdit={isAuthor ? () => setEditing(true) : undefined}
          onReply={replyForm === FormType.fake ? () => setReplyForm(FormType.real) : undefined}
        />
      </div>

      <RepliesList commentId={id} replies={replies} replyForm={replyForm} setReplyForm={setReplyForm} />
    </div>
  );
};
