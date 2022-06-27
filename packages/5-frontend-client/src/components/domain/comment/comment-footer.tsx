import clsx from 'clsx';

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

type CommentFooterProps = {
  className?: string;
  commentId: string;
  upvotes: number;
  downvotes: number;
  showActions: boolean;
  isReply: boolean;
  onShowActions: () => void;
  onEdit?: () => void;
  onReply?: () => void;
};

export const CommentFooter = ({
  className,
  commentId,
  upvotes,
  downvotes,
  showActions,
  isReply,
  onShowActions,
  onEdit,
  onReply,
}: CommentFooterProps) => (
  <div className={clsx('row', className)}>
    <div className="overflow-x-auto gap-x-2 row hide-scrollbars">
      <FooterButton icon={<ThumbUpIcon />}>{upvotes}</FooterButton>
      <FooterButton icon={<ThumbDownIcon />}>{downvotes}</FooterButton>

      {showActions && (
        <>
          {onEdit && (
            <FooterButton icon={<EditIcon />} onClick={onEdit}>
              Éditer
            </FooterButton>
          )}

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

    {onReply && (
      <FooterButton icon={<ReplyIcon />} onClick={onReply} className="pl-2 ml-auto">
        <span className="hidden xxs:block">Répondre</span>
      </FooterButton>
    )}
  </div>
);

type FooterButtonProps = IconButtonProps;

export const FooterButton = ({ className, ...props }: FooterButtonProps) => (
  <IconButton
    small
    className={clsx('p-0 hover:text-primary fill-muted hover:fill-primary button-secondary', className)}
    {...props}
  />
);
