import classNames from 'classnames';

import { IconButton, IconButtonProps } from '~/components/elements/icon-button';
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
  upvotes: number;
  downvotes: number;
  showActions: boolean;
  isReply: boolean;
  onShowActions: () => void;
  onEdit: () => void;
  onReply?: () => void;
};

export const CommentFooter = ({
  className,
  upvotes,
  downvotes,
  showActions,
  isReply,
  onShowActions,
  onEdit,
  onReply,
}: CommentFooterProps) => (
  <div className={classNames('flex flex-row justify-between', className)}>
    <div className="flex overflow-x-auto flex-row gap-x-2 hide-scrollbars">
      <FooterButton icon={<ThumbUpIcon />}>{upvotes}</FooterButton>
      <FooterButton icon={<ThumbDownIcon />}>{downvotes}</FooterButton>

      {showActions && (
        <>
          <FooterButton icon={<EditIcon />} onClick={onEdit}>
            Éditer
          </FooterButton>
          {!isReply && <FooterButton icon={<SubscribeIcon />}>Suivre</FooterButton>}
          <FooterButton icon={<ReportIcon />}>Signaler</FooterButton>
          <FooterButton icon={<ShareIcon />}>Partager</FooterButton>
        </>
      )}

      {!showActions && <FooterButton icon={<HorizontalDotsIcon />} onClick={onShowActions} />}
    </div>

    {onReply && (
      <FooterButton icon={<ReplyIcon />} onClick={onReply} className="pl-2">
        <span className="hidden xxs:block">Répondre</span>
      </FooterButton>
    )}
  </div>
);

type FooterButtonProps = IconButtonProps;

export const FooterButton = ({ className, ...props }: FooterButtonProps) => (
  <>
    <IconButton
      small
      className={classNames('p-0 hover:text-primary button-secondary', className)}
      {...props}
    />
  </>
);
