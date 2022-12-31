import { clsx } from 'clsx';
import { commentSelectors, ReactionType } from '@shakala/frontend-domain';

import { useAppSelector } from '~/hooks/use-app-selector';
import HorizontalDotsIcon from '~/icons/horizontal-dots.svg';

import { EditButton } from './comment-actions/edit-button';
import { HistoryButton } from './comment-actions/history-button';
import { ReactionButton } from './comment-actions/reaction-button';
import { ReplyButton } from './comment-actions/reply-button';
import { ReportButton } from './comment-actions/report-button';
import { ShareButton } from './comment-actions/share-button';
import { SubscribeButton } from './comment-actions/subscribe-button';
import { FooterButton } from './components/footer-button';

type CommentFooterProps = {
  className?: string;
  commentId: string;
  showActions: boolean;
  onShowActions: () => void;
};

export const CommentFooter = ({ className, commentId, showActions, onShowActions }: CommentFooterProps) => {
  const { upvotes, downvotes } = useAppSelector(commentSelectors.byId, commentId);
  const isEditing = useAppSelector(commentSelectors.isEditing, commentId);

  if (isEditing) {
    return null;
  }

  return (
    <div className={clsx('row', className)}>
      <div className="row hide-scrollbars gap-x-2 overflow-x-auto">
        <ReactionButton commentId={commentId} reactionType={ReactionType.upvote}>
          {upvotes}
        </ReactionButton>

        <ReactionButton commentId={commentId} reactionType={ReactionType.downvote}>
          {downvotes}
        </ReactionButton>

        {showActions && <CollapsedActions commentId={commentId} />}

        {!showActions && (
          <FooterButton title="Voir plus..." icon={<HorizontalDotsIcon />} onClick={onShowActions} />
        )}
      </div>

      <ReplyButton commentId={commentId} />
    </div>
  );
};

type CollapsedActionsProps = {
  commentId: string;
};

const CollapsedActions = ({ commentId }: CollapsedActionsProps) => (
  <>
    <EditButton commentId={commentId} />
    <SubscribeButton commentId={commentId} />
    <ReportButton commentId={commentId} />
    <HistoryButton commentId={commentId} />
    <ShareButton commentId={commentId} />
  </>
);
