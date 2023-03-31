import { CommentDto, ReactionType } from '@shakala/shared';
import { clsx } from 'clsx';

import HorizontalDotsIcon from '~/icons/horizontal-dots.svg';

import { EditButton } from './footer/edit-button';
import { FooterButton } from './footer/footer-button';
import { HistoryButton } from './footer/history-button';
import { ReactionButton } from './footer/reaction-button';
import { ReplyButton } from './footer/reply-button';
import { ReportButton } from './footer/report-button';
import { ShareButton } from './footer/share-button';
import { SubscribeButton } from './footer/subscribe-button';

type CommentFooterProps = {
  className?: string;
  comment: CommentDto;
  isEditing: boolean;
  onEdit: () => void;
  onReply?: () => void;
  showActions: boolean;
  onShowActions: () => void;
};

export const CommentFooter = ({
  className,
  comment,
  isEditing,
  onEdit,
  onReply,
  showActions,
  onShowActions,
}: CommentFooterProps) => {
  if (isEditing) {
    return null;
  }

  return (
    <div className={clsx('row', className)}>
      <div className="row hide-scrollbars gap-x-2 overflow-x-auto">
        <ReactionButton comment={comment} reactionType={ReactionType.upvote}>
          {comment.upvotes}
        </ReactionButton>

        <ReactionButton comment={comment} reactionType={ReactionType.downvote}>
          {comment.downvotes}
        </ReactionButton>

        {showActions && <CollapsedActions comment={comment} onEdit={onEdit} />}

        {!showActions && (
          <FooterButton title="Voir plus..." icon={<HorizontalDotsIcon />} onClick={onShowActions} />
        )}
      </div>

      {onReply && <ReplyButton onClick={onReply} />}
    </div>
  );
};

type CollapsedActionsProps = {
  comment: CommentDto;
  onEdit: () => void;
};

const CollapsedActions = ({ comment, onEdit }: CollapsedActionsProps) => (
  <>
    <EditButton onClick={onEdit} />
    <SubscribeButton comment={comment} />
    <ReportButton comment={comment} />
    <HistoryButton comment={comment} />
    <ShareButton comment={comment} />
  </>
);
