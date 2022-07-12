import clsx from 'clsx';
import {
  ReactionType,
  selectCanReply,
  selectComment,
  selectIsEditingComment,
  selectIsReply,
  setIsEditingComment,
  setIsReplying,
  setReaction,
} from 'frontend-domain';

import { IconButton, IconButtonProps } from '~/components/elements/icon-button';
import { SearchParamLink } from '~/components/elements/search-param-link';
import { EditIcon } from '~/components/icons/edit';
import { HorizontalDotsIcon } from '~/components/icons/horizontal-dots';
import { ReplyIcon } from '~/components/icons/reply';
import { ReportIcon } from '~/components/icons/report';
import { ShareIcon } from '~/components/icons/share';
import { SubscribeIcon } from '~/components/icons/subscribe';
import { ThumbDownIcon } from '~/components/icons/thumb-down';
import { ThumbUpIcon } from '~/components/icons/thumb-up';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';

type CommentFooterProps = {
  className?: string;
  commentId: string;
  showActions: boolean;
  onShowActions: () => void;
};

export const CommentFooter = ({ className, commentId, showActions, onShowActions }: CommentFooterProps) => {
  const { upvotes, downvotes } = useSelector(selectComment, commentId);
  const isReply = useSelector(selectIsReply, commentId);
  const isEditing = useSelector(selectIsEditingComment, commentId);

  if (isEditing) {
    return null;
  }

  return (
    <div className={clsx('row', className)}>
      <div className="overflow-x-auto gap-x-2 row hide-scrollbars">
        <ReactionButton commentId={commentId} reactionType={ReactionType.upvote}>
          {upvotes}
        </ReactionButton>
        <ReactionButton commentId={commentId} reactionType={ReactionType.downvote}>
          {downvotes}
        </ReactionButton>

        {showActions && (
          <>
            <EditButton commentId={commentId} />

            {!isReply && <FooterButton icon={<SubscribeIcon />}>Suivre</FooterButton>}

            <FooterButton icon={<ReportIcon />}>Signaler</FooterButton>

            <SearchParamLink
              param="share"
              value={commentId}
              className="items-center p-0 text-sm hover:text-primary fill-muted hover:fill-primary row button-secondary button"
            >
              <ShareIcon className="mr-0.5 w-4 h-4" /> Partager
            </SearchParamLink>
          </>
        )}

        {!showActions && <FooterButton icon={<HorizontalDotsIcon />} onClick={onShowActions} />}
      </div>

      <ReplyButton commentId={commentId} />
    </div>
  );
};

type FooterButtonProps = IconButtonProps & {
  active?: boolean;
};

const FooterButton = ({ className, active, ...props }: FooterButtonProps) => (
  <IconButton
    small
    className={clsx('text-muted hover:text-primary button-secondary', active && '!text-primary', className)}
    {...props}
  />
);

type ReactionButtonProps = {
  commentId: string;
  reactionType: ReactionType;
  children: React.ReactNode;
};

const ReactionButton = ({ commentId, reactionType, children }: ReactionButtonProps) => {
  const dispatch = useDispatch();

  const { userReaction } = useSelector(selectComment, commentId);

  return (
    <FooterButton
      icon={reactionIconMap[reactionType]}
      active={userReaction === reactionType}
      onClick={() => dispatch(setReaction(commentId, reactionType))}
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
  const dispatch = useDispatch();

  return (
    <FooterButton icon={<EditIcon />} onClick={() => dispatch(setIsEditingComment(commentId))}>
      Éditer
    </FooterButton>
  );
};

type ReplyButtonProps = {
  commentId: string;
};

const ReplyButton = ({ commentId }: ReplyButtonProps) => {
  const dispatch = useDispatch();
  const canReply = useSelector(selectCanReply, commentId);

  if (!canReply) {
    return null;
  }

  return (
    <FooterButton
      icon={<ReplyIcon />}
      onClick={() => dispatch(setIsReplying(commentId, true))}
      className="pl-2 ml-auto"
    >
      <span className="hidden xxs:block">Répondre</span>
    </FooterButton>
  );
};
