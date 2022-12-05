import { clsx } from 'clsx';
import { commentActions, commentSelectors, ReactionType } from 'frontend-domain';

import { IconButton, IconButtonProps } from '~/elements/icon-button';
import { SearchParamLink } from '~/elements/search-param-link';
import { useSnackbar } from '~/elements/snackbar';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';
import EditIcon from '~/icons/edit.svg';
import HistoryIcon from '~/icons/history.svg';
import HorizontalDotsIcon from '~/icons/horizontal-dots.svg';
import ReplyIcon from '~/icons/reply.svg';
import ReportIcon from '~/icons/report.svg';
import ShareIcon from '~/icons/share.svg';
import SubscribeIcon from '~/icons/subscribe.svg';
import ThumbDownIcon from '~/icons/thumb-down.svg';
import ThumbUpIcon from '~/icons/thumb-up.svg';

type CommentFooterProps = {
  className?: string;
  commentId: string;
  showActions: boolean;
  onShowActions: () => void;
};

export const CommentFooter = ({ className, commentId, showActions, onShowActions }: CommentFooterProps) => {
  const dispatch = useAppDispatch();

  const { upvotes, downvotes, edited } = useAppSelector(commentSelectors.byId, commentId);
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

        {showActions && (
          <>
            <EditButton commentId={commentId} />

            <SubscribeButton commentId={commentId} />

            <FooterButton
              icon={<ReportIcon />}
              onClick={() => dispatch(commentActions.openReportModal(commentId))}
            >
              Signaler
            </FooterButton>

            <SearchParamLink
              param="historique"
              value={commentId}
              disabled={edited === false}
              title={edited === false ? "Ce commentaire n'a pas été édité" : undefined}
              className={clsx(
                'row button-secondary button items-center fill-muted p-0 text-xs hover:fill-primary hover:text-primary',
                edited === false && 'cursor-default text-muted/60 hover:text-muted/60',
              )}
            >
              <HistoryIcon className="mr-0.5 h-4 w-4" />
              Historique
            </SearchParamLink>

            <SearchParamLink
              param="share"
              value={commentId}
              className="row button-secondary button items-center fill-muted p-0 text-xs hover:fill-primary hover:text-primary"
            >
              <ShareIcon className="mr-0.5 h-4 w-4" /> Partager
            </SearchParamLink>
          </>
        )}

        {!showActions && (
          <FooterButton title="Voir plus..." icon={<HorizontalDotsIcon />} onClick={onShowActions} />
        )}
      </div>

      <ReplyButton commentId={commentId} />
    </div>
  );
};

type FooterButtonProps = IconButtonProps & {
  active?: boolean;
};

const FooterButton = ({ className, active, ...props }: FooterButtonProps) => (
  <IconButton secondary small className={clsx(active && '!text-primary', className)} {...props} />
);

type ReactionButtonProps = {
  commentId: string;
  reactionType: ReactionType;
  children: React.ReactNode;
};

const ReactionButton = ({ commentId, reactionType, children }: ReactionButtonProps) => {
  const dispatch = useAppDispatch();

  const { userReaction } = useAppSelector(commentSelectors.byId, commentId);
  const isAuthor = useAppSelector(commentSelectors.isAuthor, commentId);

  return (
    <FooterButton
      icon={reactionIconMap[reactionType]}
      active={userReaction === reactionType}
      onClick={() => dispatch(commentActions.setReaction(commentId, reactionType))}
      disabled={isAuthor}
      title={isAuthor ? "Vous ne pouvez pas voter pour un commentaire dont vous êtes l'auteur" : undefined}
    >
      {children}
    </FooterButton>
  );
};

const reactionIconMap: Record<ReactionType, JSX.Element> = {
  [ReactionType.upvote]: <ThumbUpIcon />,
  [ReactionType.downvote]: <ThumbDownIcon />,
};

type EditCommentProps = {
  commentId: string;
};

const EditButton = ({ commentId }: EditCommentProps) => {
  const dispatch = useAppDispatch();

  return (
    <FooterButton icon={<EditIcon />} onClick={() => dispatch(commentActions.setEditing(commentId, true))}>
      Éditer
    </FooterButton>
  );
};

type SubscribeButtonProps = {
  commentId: string;
};

const SubscribeButton = ({ commentId }: SubscribeButtonProps) => {
  const snackbar = useSnackbar();
  const canSubscribe = useAppSelector(commentSelectors.canSubscribe, commentId);
  const isSubscribed = useAppSelector(commentSelectors.isSubscribed, commentId);

  if (!canSubscribe) {
    return null;
  }

  return (
    <FooterButton
      icon={<SubscribeIcon />}
      active={isSubscribed}
      onClick={() => snackbar.warning("Cette fonctionnalité n'est pas encore disponible")}
    >
      {isSubscribed ? 'Suivi' : 'Suivre'}
    </FooterButton>
  );
};

type ReplyButtonProps = {
  commentId: string;
};

const ReplyButton = ({ commentId }: ReplyButtonProps) => {
  const dispatch = useAppDispatch();
  const canReply = useAppSelector(commentSelectors.canReply, commentId);

  if (!canReply) {
    return null;
  }

  return (
    <FooterButton
      icon={<ReplyIcon />}
      onClick={() => dispatch(commentActions.setReplying(commentId, true))}
      title="Répondre"
      className="ml-auto pl-2"
    >
      <span className="xxs:block hidden">Répondre</span>
    </FooterButton>
  );
};
