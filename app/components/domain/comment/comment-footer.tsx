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
  upvotes: number;
  downvotes: number;
  showActions: boolean;
  isReply: boolean;
  onShowActions: () => void;
  onReply?: () => void;
};

export const CommentFooter = ({
  upvotes,
  downvotes,
  showActions,
  isReply,
  onShowActions,
  onReply,
}: CommentFooterProps) => (
  <div className="flex flex-row justify-between">
    <div className="flex flex-row gap-x-2">
      <FooterButton icon={<ThumbUpIcon />}>{upvotes}</FooterButton>
      <FooterButton icon={<ThumbDownIcon />}>{downvotes}</FooterButton>

      {showActions && (
        <>
          <FooterButton icon={<EditIcon />}>Éditer</FooterButton>
          {!isReply && <FooterButton icon={<SubscribeIcon />}>Suivre</FooterButton>}
          <FooterButton icon={<ReportIcon />}>Signaler</FooterButton>
          <FooterButton icon={<ShareIcon />}>Partager</FooterButton>
        </>
      )}

      {!showActions && <FooterButton icon={<HorizontalDotsIcon />} onClick={onShowActions} />}
    </div>

    {onReply && (
      <FooterButton icon={<ReplyIcon />} onClick={onReply}>
        Répondre
      </FooterButton>
    )}
  </div>
);

type FooterButtonProps = IconButtonProps;

export const FooterButton = ({ ...props }: FooterButtonProps) => (
  <>
    <IconButton small className="p-0 hover:text-primary button-secondary" {...props} />
  </>
);
